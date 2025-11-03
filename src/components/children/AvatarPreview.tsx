import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getAssetUrl } from '@/constants/avatarAssets';

interface AvatarPreviewProps {
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairStyle: string;
  favoriteColor: string;
  accessory: string;
  comfortItem: string;
}

export function AvatarPreview({
  skinTone,
  eyeColor,
  hairColor,
  hairStyle,
  favoriteColor,
  accessory,
  comfortItem,
}: AvatarPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isCancelled = false;

    const generateComposite = async () => {
      setLoading(true);
      setError(false);

      try {
        // Set canvas size
        canvas.width = 200;
        canvas.height = 200;
        
        // Clear canvas with background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 200, 200);

        // Define the layers in order (back to front)
        const layers = [
          { url: getAssetUrl('faces', skinTone), name: 'face' },
          { url: getAssetUrl('clothing', favoriteColor), name: 'clothing' },
          { url: getAssetUrl('eyes', eyeColor), name: 'eyes' },
          { url: getAssetUrl('hair', `${hairStyle}-${hairColor}`), name: 'hair' },
          accessory !== 'none' ? { url: getAssetUrl('accessories', accessory), name: 'accessory' } : null,
          comfortItem !== 'none' ? { url: getAssetUrl('comfortItems', comfortItem), name: 'comfort' } : null,
        ].filter(Boolean) as { url: string; name: string }[];

        console.log('Loading avatar layers:', layers);

        // Load and draw each layer
        for (const layer of layers) {
          if (isCancelled) return;
          
          try {
            const img = await loadImage(layer.url);
            if (isCancelled) return;
            
            // Draw image at full canvas size
            ctx.drawImage(img, 0, 0, 200, 200);
            
            console.log(`✓ Loaded ${layer.name} layer:`, {
              url: layer.url,
              width: img.naturalWidth,
              height: img.naturalHeight,
              hasAlpha: layer.url.includes('.png')
            });
          } catch (imgError) {
            console.warn(`✗ Failed to load ${layer.name} layer:`, layer.url, imgError);
          }
        }

        if (!isCancelled) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error generating composite avatar:', err);
        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    generateComposite();

    return () => {
      isCancelled = true;
    };
  }, [skinTone, eyeColor, hairColor, hairStyle, favoriteColor, accessory, comfortItem]);

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-[200px] h-[200px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-2xl">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-2xl">
            <p className="text-sm text-muted-foreground">Preview unavailable</p>
          </div>
        )}
        <canvas 
          ref={canvasRef}
          className="w-full h-full rounded-2xl shadow-lg"
          style={{ display: loading || error ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}

// Helper function to load images
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
