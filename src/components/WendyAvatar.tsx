import wendyAvatarImg from '@/assets/wendy-avatar.jpg';

interface WendyAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WendyAvatar({ size = 'md', className = '' }: WendyAvatarProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-primary/10 flex-shrink-0 ${className}`}>
      <img
        src={wendyAvatarImg}
        alt="Wendy AI - Your supportive companion"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
