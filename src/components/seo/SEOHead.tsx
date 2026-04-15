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
  image = '/portrait.jpg',
  type = 'website'
}: SEOHeadProps) {
  const location = useLocation();
  
  // More aggressive title for ranking "Aakash Agrahari"
  const fullTitle = title 
    ? `${title} | Aakash Agrahari — Developer & Builder` 
    : `Aakash Agrahari — Official Portfolio | Full Stack Developer & AI Enthusiast`;
  
  const defaultDescription = `Aakash Agrahari is a full-stack developer, hackathon winner, and entrepreneur from Guwahati, India and Butwal, Nepal. Specialized in AI/ML, React, and building scalable products.`;
  const fullDescription = description || defaultDescription;
  
  const baseUrl = "https://aakashagrahari.com.np"; // Update with your actual domain
  const fullUrl = `${baseUrl}${location.pathname}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="author" content="Aakash Agrahari" />
      <meta name="keywords" content="Aakash Agrahari, Aakash Agrahari Portfolio, Aakash Agrahari Developer, Aakash Agrahari Official Website, Aakash Agrahari Nepal, Aakash Agrahari India, Full Stack Developer, AI Enthusiast, Hackathon Winner, Assam Royal Global University, CrewSpace AI, Intellaris Studio" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:site_name" content="Aakash Agrahari Portfolio" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />

      {/* JSON-LD Structured Data for Aakash Agrahari Entity */}
      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Aakash Agrahari",
            "alternateName": "aakash_zip",
            "url": "https://aakashagrahari.com.np",
            "jobTitle": "Full Stack Developer & AI Enthusiast",
            "gender": "male",
            "nationality": {
              "@type": "Country",
              "name": "Nepal"
            },
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Assam Royal Global University"
            },
            "description": "Full-stack developer, hackathon winner, and startup contributor from Guwahati, India. Specialized in AI, React, and product engineering.",
            "image": "https://aakashagrahari.com.np/portrait.jpg",
            "sameAs": [
              "https://github.com/aakashagraharifun",
              "https://aakashpoems.cloud/",
              "https://www.instagram.com/aakash_zip/",
              "https://linkedin.com/in/aakashagrahari"
            ],
            "knowsAbout": [
              "Full Stack Development",
              "AI/ML",
              "React",
              "Next.js",
              "Node.js",
              "Supabase",
              "Entrepreneurship"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Aakash Agrahari — Personal Portfolio",
            "url": "https://aakashagrahari.com.np",
            "description": "The official portfolio website of Aakash Agrahari, showcasing projects, awards, and technical expertise.",
            "publisher": {
              "@type": "Person",
              "name": "Aakash Agrahari"
            }
          },
          // Breadcrumb Schema
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
                "name": title || location.pathname.split('/').pop()?.toUpperCase() || "Page",
                "item": fullUrl
              }
            ].filter(Boolean)
          }
        ])}
      </script>
    </Helmet>
  );
}
