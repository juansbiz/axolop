import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// Base URL for hreflang tags
const BASE_URL = 'https://www.axolop.com';

// Supported languages for hreflang
const SUPPORTED_LANGUAGES = [
  { code: 'en', hreflang: 'en' },
  { code: 'es', hreflang: 'es' },
];

const SEO = ({
  title = 'Axolop - Ecommerce CRM | Replace Klaviyo & Omnisend',
  description = 'Axolop: The email marketing CRM for ecommerce. Replace Klaviyo, Omnisend, and Mailchimp with one flat-price platform. Save money, own your data, scale forever.',
  keywords = 'ecommerce CRM, Klaviyo alternative, Omnisend alternative, Mailchimp alternative, email marketing CRM, Shopify CRM, DTC CRM, ecommerce email marketing, ecommerce automation, own your data CRM',
  url = 'https://www.axolop.com',
  image = 'https://www.axolop.com/axolop-og-image.jpg',
  twitterImage = 'https://www.axolop.com/axolop-twitter-image.jpg',
  type = 'website',
  author = 'Axolop LLC',
  rating = '4.8',
  reviewCount = '250',
  price = '149.00',
  priceCurrency = 'USD',
  affiliateName = null,
  noHreflang = false, // Set to true for pages that shouldn't have language alternates
  language = null, // Current page language (auto-detected if not provided)
}) => {
  const location = useLocation();

  // Detect current language from URL
  const currentLanguage = language || (() => {
    // Only detect /es/ prefix, treat no prefix as English (default)
    const pathMatch = location.pathname.match(/^\/es(\/|$)/);
    return pathMatch ? 'es' : 'en';
  })();

  // Get the path without language prefix for building alternates
  const pathWithoutLang = location.pathname.replace(/^\/(en|es)(\/|$)/, '/').replace(/^\/+/, '/');

  // Build hreflang URLs
  const getAlternateUrl = (langCode) => {
    const cleanPath = pathWithoutLang === '/' ? '' : pathWithoutLang;
    // Only add /es/ prefix for Spanish, no prefix for English
    if (langCode === 'es') {
      return `${BASE_URL}/es${cleanPath}`;
    }
    return `${BASE_URL}${cleanPath}`;
  };

  // Determine og:locale based on language
  const ogLocale = currentLanguage === 'es' ? 'es_419' : 'en_US';
  // Dynamic content based on affiliate
  const seoTitle = affiliateName 
    ? `Join ${affiliateName}'s Team - ${title}` 
    : title;
  
  const seoDescription = affiliateName
    ? `Join ${affiliateName}'s team with a 30-day free trial of Axolop. ${description}`
    : description;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#101010" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Axolop - All-in-One Business Platform" />
      <meta property="og:site_name" content="Axolop" />
      <meta property="og:locale" content={ogLocale} />
      {currentLanguage === 'es' && <meta property="og:locale:alternate" content="en_US" />}
      {currentLanguage === 'en' && <meta property="og:locale:alternate" content="es_419" />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content="Axolop - All-in-One Business Platform" />
      <meta name="twitter:site" content="@axolopcrm" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Language alternate tags (hreflang) */}
      <html lang={currentLanguage} />

      {/* Only generate language alternates for app pages */}
      {/* Public pages are English-only and don't need hreflang tags */}
      {!noHreflang && location.pathname.includes('/app/') && (
        <>
          {SUPPORTED_LANGUAGES.map(({ code, hreflang }) => (
            <link
              key={code}
              rel="alternate"
              hrefLang={hreflang}
              href={getAlternateUrl(code)}
            />
          ))}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={getAlternateUrl('en')}
          />
        </>
      )}
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Axolop",
          "description": seoDescription,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": priceCurrency,
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": reviewCount
          },
          "creator": {
            "@type": "Organization",
            "name": author
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;