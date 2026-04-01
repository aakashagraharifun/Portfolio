import { ArrowUpRight, FileText } from 'lucide-react';

interface BlogContentRendererProps {
  content?: string | null;
}

const imagePattern = /\.(png|jpe?g|gif|webp|svg|avif)$/i;
const documentPattern = /\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt)$/i;
const markdownImagePattern = /^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/i;
const markdownLinkPattern = /^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/i;
const urlPattern = /^https?:\/\/\S+$/i;

function renderDocumentLink(url: string, label?: string) {
  const isPdf = /\.pdf($|\?)/i.test(url);

  return (
    <div className="space-y-4">
      {isPdf && (
        <div className="aspect-[4/3] overflow-hidden border-2 border-black bg-white">
          <iframe src={url} title={label || 'Document preview'} className="h-full w-full" />
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex min-h-16 items-center gap-4 border-2 border-black bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition-all hover:bg-primary"
      >
        <FileText className="size-5" />
        <span>{label || 'Open Document'}</span>
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function renderTextBlock(block: string, index: number) {
  return (
    <p key={index} className="whitespace-pre-wrap break-words text-xl md:text-2xl leading-relaxed">
      {block}
    </p>
  );
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const blocks = (content || '')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return (
      <p className="text-xl md:text-2xl leading-relaxed text-black/60">
        No article content has been added yet.
      </p>
    );
  }

  return (
    <div className="space-y-12 text-black/80 font-medium tracking-tight selection:bg-primary">
      {blocks.map((block, index) => {
        const markdownImageMatch = block.match(markdownImagePattern);
        if (markdownImageMatch) {
          const [, alt, src] = markdownImageMatch;
          return (
            <div key={index} className="overflow-hidden border-4 border-black bg-white shadow-[16px_16px_0px_rgba(255,214,0,0.65)]">
              <img src={src} alt={alt || 'Blog media'} className="h-full w-full object-cover" />
            </div>
          );
        }

        const markdownLinkMatch = block.match(markdownLinkPattern);
        if (markdownLinkMatch) {
          const [, label, href] = markdownLinkMatch;
          return <div key={index}>{renderDocumentLink(href, label)}</div>;
        }

        if (block.startsWith('```') && block.endsWith('```')) {
          const lines = block.split('\n');
          const language = lines[0].replace(/```/g, '').trim();
          const code = lines.slice(1, -1).join('\n');

          return (
            <div key={index} className="border-2 border-black bg-black p-6 text-primary shadow-[12px_12px_0px_rgba(255,214,0,0.4)]">
              {language && (
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-primary/70">
                  {language}
                </p>
              )}
              <pre className="whitespace-pre-wrap break-words text-sm leading-7">{code}</pre>
            </div>
          );
        }

        if (urlPattern.test(block)) {
          if (imagePattern.test(block)) {
            return (
              <div key={index} className="overflow-hidden border-4 border-black bg-white shadow-[16px_16px_0px_rgba(255,214,0,0.65)]">
                <img src={block} alt="Blog media" className="h-full w-full object-cover" />
              </div>
            );
          }

          if (documentPattern.test(block) || block.includes('docs.google.com') || block.includes('drive.google.com')) {
            return <div key={index}>{renderDocumentLink(block)}</div>;
          }
        }

        return renderTextBlock(block, index);
      })}
    </div>
  );
}
