import React, { useState, useEffect } from 'react';

const CachedImage = ({ src, alt, className, style, fallbackClassName }) => {
  const [cachedSrc, setCachedSrc] = useState(null);

  useEffect(() => {
    let objectUrl = null;
    let isMounted = true;

    const loadImage = async () => {
      if (!src) return;
      
      try {
        const cache = await caches.open('inventory-image-cache');
        let response = await cache.match(src);

        if (!response) {
          // Attempt to fetch and cache
          response = await fetch(src, { mode: 'cors' });
          if (response.ok) {
            await cache.put(src, response.clone());
          }
        }
        
        if (response && response.ok) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          if (isMounted) setCachedSrc(objectUrl);
        } else {
          if (isMounted) setCachedSrc(src);
        }
      } catch (err) {
        // Fallback to normal rendering if CORS or fetch fails
        if (isMounted) setCachedSrc(src);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (!src) {
    return <span className={fallbackClassName || "no-img"}>N/A</span>;
  }

  return (
    <img 
      src={cachedSrc || src} 
      alt={alt || 'Product Image'} 
      className={className} 
      style={style} 
    />
  );
};

export default CachedImage;
