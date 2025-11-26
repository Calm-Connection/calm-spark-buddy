interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <div className={`relative mb-4 ${className}`}>
      <div className="absolute inset-0 bg-card/60 backdrop-blur-sm rounded-xl -m-2 border border-border/20" />
      <h2 className="relative text-xl font-bold px-2">
        {children}
      </h2>
    </div>
  );
}
