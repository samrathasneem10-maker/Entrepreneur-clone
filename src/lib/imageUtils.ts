/**
 * Image processing utilities for converting images to WebP format.
 * Converts JPG, PNG, GIF, BMP, TIFF, SVG, etc. into high-performance, compressed .webp format.
 */

export async function convertImageToWebP(
  input: File | string,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<{ webpDataUrl: string; webpFileName: string }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('WebP conversion requires browser environment'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Scale proportionally if dimensions exceed max boundaries
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        const webpDataUrl = canvas.toDataURL('image/webp', quality);

        let webpFileName = 'image.webp';
        if (typeof input !== 'string' && input.name) {
          const base = input.name.replace(/\.[^/.]+$/, '');
          webpFileName = `${base}.webp`;
        }

        resolve({ webpDataUrl, webpFileName });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      reject(err);
    };

    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(input);
    }
  });
}
