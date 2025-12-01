interface ConnectionBadgeProps {
  message?: string;
}

export function ConnectionBadge({ message = "Try this with your grown-up!" }: ConnectionBadgeProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-warm/20 border border-warm/30 rounded-lg">
      <span className="text-2xl">👨‍👩‍👧</span>
      <span className="text-sm font-medium text-foreground">{message}</span>
    </div>
  );
}
