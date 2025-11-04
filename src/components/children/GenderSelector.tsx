import { Card } from '@/components/ui/card';

interface GenderSelectorProps {
  value: string;
  onChange: (gender: string) => void;
}

const genderOptions = [
  { id: 'male', label: 'Male', emoji: '🙋‍♂️' },
  { id: 'female', label: 'Female', emoji: '🙋‍♀️' },
  { id: 'prefer_not_to_say', label: 'Prefer not to say', emoji: '🙋' },
];

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Gender Presentation (Optional)</h3>
      <p className="text-xs text-muted-foreground">
        This helps guide how your avatar is styled, but you can still customize everything!
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
