import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { photographerInfo } from '@/data/photographer';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

/**
 * SEO component for managing page meta tags
 * Handles title, description, and Open Graph tags using react-helmet-async
 */
export function SEOHead({ 
  title, 
  description, 
  image = '/og-image.png',
  type = 'website'
}: SEOHeadProps) {
  const location = useLocation();
  
  const fullTitle = title 
    ? `${title} | ${photographerInfo.name}` 
    : `${photographerInfo.name} — ${photographerInfo.tagline}`;
  
  const defaultDescription = photographerInfo.heroIntroduction;
  const fullDescription = description || defaultDescription;
  
  const baseUrl = "https://aakashagrahari.com.np"; // Update with your actual domain
  const fullUrl = `${baseUrl}${location.pathname}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="author" content={photographerInfo.name} />
      <meta name="keywords" content={`developer, ${photographerInfo.name}, full stack, hackathon winner, AI enthusiast, ${photographerInfo.tagline}, Guwahati, Nepal`} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={photographerInfo.name} />
      <meta property="og:see_also" content="https://www.instagram.com/aakash_zip/" />
      <meta name="instagram:username" content="aakash_zip" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data for Aakash Agrahari Entity */}
      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Aakash Agrahari",
            "url": "https://aakashagrahari.com.np",
            "jobTitle": "Full Stack Developer & AI Enthusiast",
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Assam Royal Global University"
            },
            "description": "Hackathon winner, startup contributor, and developer from Guwahati, India.",
            "image": "https://aakashagrahari.com.np/portrait.jpg",
            "sameAs": [
              "https://github.com/aakashagraharifun",
              "https://aakashpoems.cloud/",
              "https://www.instagram.com/aakash_zip/"
            ],
            "knowsAbout": [
              "Full Stack Development",
              "AI/ML",
              "React",
              "Next.js",
              "Supabase",
              "Entrepreneurship"
            ]
          },
          // Breadcrumb Schema for better search hierarchy
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://aakashagrahari.com.np"
              },
              location.pathname !== '/' && {
                "@type": "ListItem",
                "position": 2,
                "name": title || location.pathname.split('/').pop()?.toUpperCase(),
                "item": fullUrl
              }
            ].filter(Boolean)
          }
        ])}
      </script>
    </Helmet>
  );
}
