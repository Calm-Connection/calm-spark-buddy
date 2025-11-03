import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarData {
  skinTone?: string;
  hairStyle?: string;
  accessory?: string;
  expression?: string;
  emoji?: string;
  imageUrl?: string;
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
