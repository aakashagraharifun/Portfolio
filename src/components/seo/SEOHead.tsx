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

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@aakash_zip" />
    </Helmet>
  );
}
