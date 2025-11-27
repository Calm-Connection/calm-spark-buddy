import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ObjectAvatarPreviewProps {
  objectType: string;
  mainColor: string;
  accentColor: string;
  eyeStyle: string;
  eyeColor: string;
  accessory: string;
  comfortItem: string;
  age?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ObjectAvatarPreview({
  objectType,
  mainColor,
  accentColor,
  eyeStyle,
  eyeColor,
  accessory,
  comfortItem,
  age = 'child',
  size = 'lg',
  className = '',
}: ObjectAvatarPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  // No auto-generation - this component is now display-only
  // Only used during avatar creation in ObjectAvatarBuilder
  useEffect(() => {
    // Component is for preview during creation only
    // Actual saved avatars use imageUrl from database
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-2xl bg-muted/20 flex items-center justify-center`}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground text-sm`}>
        {error || 'Preview coming soon...'}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Avatar preview"
      className={`${sizeClasses[size]} ${className} rounded-2xl object-cover shadow-lg`}
    />
  );
}
