import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Professional Roblox VFX Artist Portfolio showcasing high-quality particle systems, magic effects, and immersive game visuals.", 
  image = "https://res.cloudinary.com/dxhlvrach/image/upload/v1763831510/backgroundgalo_a9ds1q.png", 
  url = window.location.href 
}) => {
  useEffect(() => {
    // 1. Update Title
    const siteTitle = `${title} | GaloDev VFX`;
    document.title = siteTitle;

    // 2. Helper function to update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      // Try to find the element by name or property
      let element = isProperty 
        ? document.querySelector(`meta[property="${name}"]`) 
        : document.querySelector(`meta[name="${name}"]`);

      // Create if it doesn't exist
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) element.setAttribute('property', name);
        else element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      
      // Update content
      element.setAttribute('content', content);
    };

    // 3. Update Standard Meta Tags
    if (description) {
      updateMeta('description', description);
    }

    // 4. Update Open Graph (Facebook/Discord)
    updateMeta('og:title', siteTitle, true);
    if (description) updateMeta('og:description', description, true);
    if (image) updateMeta('og:image', image, true);
    if (url) updateMeta('og:url', url, true);
    updateMeta('og:type', 'website', true);

    // 5. Update Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', siteTitle);
    if (description) updateMeta('twitter:description', description);
    if (image) updateMeta('twitter:image', image);
    if (url) updateMeta('twitter:url', url);

  }, [title, description, image, url]);

  // Render nothing visible
  return null;
};

export default SEO;