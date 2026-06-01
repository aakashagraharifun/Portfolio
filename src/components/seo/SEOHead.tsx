import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://aakashagrahari.com.np';
const SITE_NAME = 'Aakash Agrahari';
const DEFAULT_OG_IMAGE = '/portrait.jpg';
const DEFAULT_DESCRIPTION =
  'Portfolio of Aakash Agrahari — full stack developer, hackathon winner, and AI builder from Guwahati, India & Butwal, Nepal. Shipping React, Next.js, and AI-powered products.';
const DEFAULT_TITLE = 'Aakash Agrahari — Full Stack Developer & AI Builder';

const PERSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aakash Agrahari',
  alternateName: 'aakash_zip',
  url: SITE_URL,
  image: `${SITE_URL}/portrait.jpg`,
  jobTitle: 'Full Stack Developer & AI Builder',
  gender: 'male',
  nationality: { '@type': 'Country', name: 'Nepal' },
  worksFor: { '@type': 'Organization', name: 'Intellaris Studio' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Assam Royal Global University'
  },
  address: [
    { '@type': 'PostalAddress', addressLocality: 'Guwahati', addressRegion: 'Assam', addressCountry: 'IN' },
    { '@type': 'PostalAddress', addressLocality: 'Butwal', addressCountry: 'NP' }
  ],
  description:
    'Full-stack developer, hackathon winner, and AI builder shipping React, Next.js, and AI-powered products.',
  sameAs: [
    'https://github.com/aakashagraharifun',
    'https://aakashpoems.cloud/',
    'https://www.instagram.com/aakash_zip/',
    'https://linkedin.com/in/aakashagrahari'
  ],
  knowsAbout: [
    'Full Stack Development',
    'AI/ML',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'Supabase',
    'PostgreSQL',
    'Python',
    'Product Engineering',
    'Hackathons',
    'Entrepreneurship'
  ]
};

const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@type': 'Person', name: SITE_NAME },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/portfolio?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

export interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  /** "website" | "article" | "profile" */
  type?: 'website' | 'article' | 'profile';
  /** Block indexing (admin/preview pages) */
  noindex?: boolean;
  /** Override canonical URL */
  canonical?: string;
  /** Breadcrumb trail (override auto-from-pathname) */
  breadcrumbs?: { name: string; path: string }[];
  /** Article-type metadata for blog/project pages */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    section?: string;
  };
  /** Inject extra JSON-LD objects (BlogPosting, CreativeWork, FAQPage, etc.) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Page-specific keyword list — used for content relevance signals */
  keywords?: string[];
}

function titleCase(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildBreadcrumbs(pathname: string, override?: SEOHeadProps['breadcrumbs']) {
  const crumbs = override ?? [
    { name: 'Home', path: '/' },
    ...pathname
      .split('/')
      .filter(Boolean)
      .map((seg, idx, arr) => ({
        name: titleCase(decodeURIComponent(seg)),
        path: '/' + arr.slice(0, idx + 1).join('/')
      }))
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`
    }))
  };
}

export function SEOHead({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  canonical,
  breadcrumbs,
  article,
  jsonLd,
  keywords
}: SEOHeadProps) {
  const location = useLocation();
  const path = location.pathname.replace(/\/+$/, '') || '/';

  const pageTitle = title
    ? `${title} | ${SITE_NAME} — Full Stack Developer`
    : DEFAULT_TITLE;
  const pageDescription = (description || DEFAULT_DESCRIPTION).slice(0, 160);
  const canonicalUrl = canonical || `${SITE_URL}${path === '/' ? '/' : path}`;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const extraJsonLd = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  const structuredData = [
    PERSON_LD,
    WEBSITE_LD,
    buildBreadcrumbs(path, breadcrumbs),
    ...extraJsonLd
  ];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />

      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={robots} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type === 'profile' ? 'profile' : type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title || SITE_NAME} />
      <meta name="twitter:creator" content="@aakash_zip" />

      {/* Article timestamps */}
      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {type === 'article' && article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {type === 'article' &&
        article?.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

/* ---------- JSON-LD helpers (use these from pages) ---------- */

export function buildCreativeWorkLd(args: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  category?: string;
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: args.title,
    headline: args.title,
    description: args.description,
    url: `${SITE_URL}/project/${args.slug}`,
    image: args.image ? (args.image.startsWith('http') ? args.image : `${SITE_URL}${args.image}`) : undefined,
    datePublished: args.datePublished,
    genre: args.category,
    keywords: args.techStack?.join(', '),
    author: { '@type': 'Person', name: SITE_NAME },
    creator: { '@type': 'Person', name: SITE_NAME },
    sameAs: [args.liveUrl, args.githubUrl].filter(Boolean)
  };
}

export function buildBlogPostingLd(args: {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.excerpt,
    image: args.image ? (args.image.startsWith('http') ? args.image : `${SITE_URL}${args.image}`) : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    url: `${SITE_URL}/blog/${args.slug}`,
    datePublished: args.publishedTime,
    dateModified: args.modifiedTime || args.publishedTime,
    keywords: args.tags?.join(', '),
    author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${args.slug}`
    }
  };
}

export function buildFAQLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  };
}

export function buildItemListLd(args: {
  name: string;
  items: { name: string; url: string; description?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: args.name,
    itemListElement: args.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: it.url,
      name: it.name,
      description: it.description
    }))
  };
}
