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
    const generateComposite = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setLoading(true);
      setError(false);

      try {
        // Define the layers in order (back to front)
        const layers = [
          getAssetUrl('faces', skinTone),
          getAssetUrl('clothing', favoriteColor),
          getAssetUrl('eyes', eyeColor),
          getAssetUrl('hair', `${hairStyle}-${hairColor}`),
          accessory !== 'none' ? getAssetUrl('accessories', accessory) : null,
          comfortItem !== 'none' ? getAssetUrl('comfortItems', comfortItem) : null,
        ].filter(Boolean) as string[];

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Load and draw each layer
        for (const layerUrl of layers) {
          try {
            const img = await loadImage(layerUrl);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          } catch (imgError) {
            console.warn(`Failed to load layer: ${layerUrl}`, imgError);
            // Continue with next layer if one fails
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error generating composite avatar:', err);
        setError(true);
        setLoading(false);
      }
    };

    generateComposite();
  }, [skinTone, eyeColor, hairColor, hairStyle, favoriteColor, accessory, comfortItem]);

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

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
          width={1024} 
          height={1024}
          className="w-full h-full rounded-2xl shadow-lg"
          style={{ display: loading || error ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}
