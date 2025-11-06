import { Card } from '@/components/ui/card';

interface AgeSelectorProps {
  value: string;
  onChange: (age: string) => void;
}

const ageOptions = [
  { id: 'child', label: 'Child (7-11)', emoji: '🧒', description: 'Younger look' },
  { id: 'teen', label: 'Teen (12-16)', emoji: '🧑', description: 'Older look' },
];

export function AgeSelector({ value, onChange }: AgeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Choose Your Age Group</h3>
      <p className="text-xs text-muted-foreground">
        This helps create an avatar that looks right for you
      </p>
      <div className="grid grid-cols-2 gap-3">
        {ageOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              value === option.id
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">{option.emoji}</span>
              <span className="font-medium text-sm">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
