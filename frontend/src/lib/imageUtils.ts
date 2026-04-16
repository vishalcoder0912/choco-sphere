import { useState, useRef, useEffect } from 'react';

// Image optimization utilities

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map(url => preloadImage(url)));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Generate optimized image URL with size parameters
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (url.startsWith('/src/assets/') || url.startsWith('http://localhost') || url.startsWith('/')) {
    // For local assets, return as-is
    return url;
  }
  
  try {
    // For Unsplash images, add size parameters
    const urlObj = new URL(url);
    if (width) urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('q', '80'); // Quality
    
    return urlObj.toString();
  } catch (error) {
    // Fallback to the original URL if it is invalid
    return url;
  }
};

// Check if image is cached
export const isImageCached = (src: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const img = new Image();
  img.src = src;
  return img.complete || img.naturalHeight !== 0;
};

// Lazy loading hook
export const useLazyImage = (src: string, threshold = 0.1) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, threshold]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  return { imageSrc, isLoading, hasError, imgRef };
};
