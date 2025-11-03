import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
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
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const isMountedRef = useRef(true);

  // Initialize Fabric canvas once on mount
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    try {
      fabricCanvasRef.current = new FabricCanvas(canvasRef.current, {
        width: 200,
        height: 200,
        backgroundColor: '#f0f0f0',
      });
    } catch (err) {
      console.error('Failed to initialize Fabric canvas:', err);
      setError(true);
    }

    // Cleanup only on unmount
    return () => {
      isMountedRef.current = false;
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (err) {
          console.error('Error disposing canvas:', err);
        }
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Update canvas content when avatar props change
  useEffect(() => {
    const generateComposite = async () => {
      if (!fabricCanvasRef.current || !isMountedRef.current) return;

      setLoading(true);
      setError(false);

      try {
        const canvas = fabricCanvasRef.current;
        
        // Guard against canvas being disposed
        if (!canvas || !isMountedRef.current) return;
        
        canvas.clear();
        canvas.backgroundColor = '#f0f0f0';

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

        // Load and add each layer
        for (const layer of layers) {
          // Check if still mounted before processing each layer
          if (!isMountedRef.current || !fabricCanvasRef.current) return;
          
          try {
            const img = await FabricImage.fromURL(layer.url, {
              crossOrigin: 'anonymous',
            });
            
            // Double check still mounted after async operation
            if (!isMountedRef.current || !fabricCanvasRef.current) return;
            
            // Scale image to fit canvas
            img.scaleToWidth(200);
            img.scaleToHeight(200);
            
            // Position at top-left
            img.set({
              left: 0,
              top: 0,
              selectable: false,
              evented: false,
            });

            canvas.add(img);
            
            // Debug transparency
            const imgElement = img.getElement() as HTMLImageElement;
            console.log(`✓ Loaded ${layer.name} layer:`, {
              url: layer.url,
              width: imgElement.naturalWidth,
              height: imgElement.naturalHeight,
              hasAlpha: layer.url.includes('.png'),
              layerCount: canvas.getObjects().length
            });
          } catch (imgError) {
            console.warn(`✗ Failed to load ${layer.name} layer:`, layer.url, imgError);
          }
        }

        // Final check before rendering
        if (isMountedRef.current && fabricCanvasRef.current) {
          canvas.renderAll();
          setLoading(false);
        }
      } catch (err) {
        console.error('Error generating composite avatar:', err);
        setError(true);
        setLoading(false);
      }
    };

    generateComposite();
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
