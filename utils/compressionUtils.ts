// Helper to get a Blob from a canvas
function getCanvasBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        // Use 'image/jpeg' as the default for lossy compression which is what we need to meet a target size.
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas to Blob conversion failed'));
                }
            },
            'image/jpeg',
            quality
        );
    });
}

/**
 * Compresses an image file to a target size using a canvas.
 * @param file The image file to compress.
 * @param targetSizeKB The target file size in kilobytes.
 * @returns A promise that resolves with the compressed blob and its actual size.
 */
export async function compressImage(file: File, targetSizeKB: number): Promise<{blob: Blob, actualSizeKB: number}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      if (!event.target?.result) {
        return reject(new Error('Could not read file for compression.'));
      }
      img.src = event.target.result as string;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        let { width, height } = img;
        const targetSizeBytes = targetSizeKB * 1024;
        
        // Cap max dimensions to prevent performance issues with huge images
        const MAX_DIMENSION = 1920;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
                height = Math.round(height * (MAX_DIMENSION / width));
                width = MAX_DIMENSION;
            } else {
                width = Math.round(width * (MAX_DIMENSION / height));
                height = MAX_DIMENSION;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Binary search for the best quality
        let low = 0;
        let high = 1;
        let bestBlob: Blob | null = null;

        for (let i = 0; i < 10; i++) { // Limit iterations for performance
            const mid = (low + high) / 2;
            const blob = await getCanvasBlob(canvas, mid);

            if (blob.size > targetSizeBytes) {
                high = mid;
            } else {
                low = mid;
                bestBlob = blob;
            }
        }

        // If we still couldn't get under the target size (e.g., target is tiny),
        // we might need to reduce dimensions further.
        if (!bestBlob) {
            bestBlob = await getCanvasBlob(canvas, 0.1); // Start with lowest quality
            while (bestBlob.size > targetSizeBytes && width > 100) {
                 width *= 0.9;
                 height *= 0.9;
                 canvas.width = Math.round(width);
                 canvas.height = Math.round(height);
                 ctx.drawImage(img, 0, 0, width, height);
                 bestBlob = await getCanvasBlob(canvas, 0.7); // Use a reasonable quality for resized images
            }
        }
        
        if (!bestBlob) {
            return reject(new Error('Could not compress the image to the target size. Try a larger target size.'));
        }

        resolve({blob: bestBlob, actualSizeKB: bestBlob.size / 1024});
      };
      img.onerror = () => reject(new Error('Could not load image file. It might be corrupt or an unsupported format.'));
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
  });
}
