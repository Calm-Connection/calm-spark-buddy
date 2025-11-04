import { Card } from '@/components/ui/card';

interface GenderSelectorProps {
  value: string;
  onChange: (gender: string) => void;
}

const genderOptions = [
  { id: 'male', label: 'Boy', emoji: '🙋‍♂️' },
  { id: 'female', label: 'Girl', emoji: '🙋‍♀️' },
  { id: 'prefer_not_to_say', label: "I'll choose later", emoji: '🙋' },
];

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Choose Your Avatar Style</h3>
      <p className="text-xs text-muted-foreground">
        Pick a style to start with - you can change anything you want!
      </p>
      <div className="grid grid-cols-1 gap-3">
        {genderOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              value === option.id
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{option.emoji}</span>
              <span className="font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
