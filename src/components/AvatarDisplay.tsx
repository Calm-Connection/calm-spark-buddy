import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarPreview } from './children/AvatarPreview';

interface AvatarData {
  type?: string;
  skinTone?: string;
  hairStyle?: string;
  accessory?: string;
  expression?: string;
  emoji?: string;
  imageUrl?: string;
  customization?: {
    skinTone: string;
    eyeColor: string;
    hairColor: string;
    hairStyle: string;
    favoriteColor: string;
    accessory: string;
    comfortItem: string;
  };
}

interface AvatarDisplayProps {
  avatarData?: AvatarData;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarDisplay({ avatarData, size = 'md', className = '' }: AvatarDisplayProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const svgSizes = {
    sm: { width: 40, height: 36 },
    md: { width: 64, height: 58 },
    lg: { width: 96, height: 86 },
  };

  // Manual custom avatar with preview
  if (avatarData?.type === 'manual_custom' && avatarData?.customization) {
    const scaleFactor = size === 'sm' ? 0.2 : size === 'md' ? 0.32 : 0.48;
    return (
      <div className={`${className} overflow-hidden rounded-full`} style={{ 
        width: svgSizes[size].width, 
        height: svgSizes[size].height 
      }}>
        <div style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top left' }}>
          <AvatarPreview {...avatarData.customization} />
        </div>
      </div>
    );
  }

  // AI-generated image avatar
  if (avatarData?.imageUrl) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={avatarData.imageUrl} alt="Avatar" />
        <AvatarFallback className="bg-muted">
          <span className={textSizes[size]}>👤</span>
        </AvatarFallback>
      </Avatar>
    );
  }

  if (avatarData?.emoji) {
    // Carer emoji avatar
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full bg-primary/20 flex items-center justify-center ${textSizes[size]}`}>
        {avatarData.emoji}
      </div>
    );
  }

  if (avatarData?.skinTone) {
    // Child custom avatar with features
    const hairStyles: { [key: string]: string } = {
      short: '👦',
      long: '👧',
      curly: '👨‍🦱',
      wavy: '👩‍🦰',
      bald: '👨‍🦲',
      afro: '👨‍🦲',
    };

    const accessories: { [key: string]: string } = {
      glasses: '👓',
      hat: '🎩',
      crown: '👑',
      bow: '🎀',
      none: '',
    };

    const expressions: { [key: string]: string } = {
      happy: '😊',
      cool: '😎',
      excited: '🤩',
      calm: '😌',
      silly: '😜',
    };

    return (
      <div 
        className={`${sizeClasses[size]} ${className} rounded-full flex items-center justify-center shadow-md relative overflow-hidden`}
        style={{ backgroundColor: avatarData.skinTone || '#FFE5D9' }}
      >
        {/* Expression */}
        <span className={textSizes[size]}>
          {expressions[avatarData.expression || 'happy'] || '😊'}
        </span>
        
        {/* Hair (if exists) */}
        {avatarData.hairStyle && (
          <span className="absolute -top-1 text-xl">
            {hairStyles[avatarData.hairStyle]}
          </span>
        )}
        
        {/* Accessory (if exists and not 'none') */}
        {avatarData.accessory && avatarData.accessory !== 'none' && (
          <span className="absolute -top-0.5 text-base">
            {accessories[avatarData.accessory]}
          </span>
        )}
      </div>
    );
  }

  // Default fallback
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback className="bg-muted">
        <span className={textSizes[size]}>👤</span>
      </AvatarFallback>
    </Avatar>
  );
}
