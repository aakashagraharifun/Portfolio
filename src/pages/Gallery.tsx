import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';
import { getGalleryImages } from '@/services/contentService';
import { Loader2, Camera, X } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getGalleryImages();
      setImages(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="size-12 animate-spin text-primary" />
    </div>
  );

  return (
    <>
      <SEOHead title="Gallery — Aakash Agrahari" description="Moments, captures, and snapshots from the builder journey." />
      
      <div className="min-h-screen bg-white pt-48 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
             <div className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest inline-block border-2 border-black">LIVE MOMENTS</div>
             <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">SNAPSHOTS.</h1>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedImg(img.image_url)}
                className="relative group cursor-pointer border-4 border-black overflow-hidden bg-primary"
              >
                <img 
                  src={img.image_url} 
                  alt={img.caption} 
                  className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-primary font-black uppercase text-xs tracking-widest italic">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-24 cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-10 right-10 text-primary hover:rotate-90 transition-transform">
            <X size={48} />
          </button>
          <img src={selectedImg} className="max-w-full max-h-full object-contain border-4 border-primary" />
        </div>
      )}
    </>
  );
}
