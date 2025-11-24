import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Sparkles, Shield, Heart, BarChart2, FileText, Users, UserX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const childSlides = [
  {
    icon: BookOpen,
    title: 'Your Journal',
    description: 'Write about your feelings, what happened today, or anything on your mind. It\'s your safe space.',
    color: 'bg-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: UserX,
    title: 'Your Safe Nickname',
    description: 'You\'ll use a fun nickname (like "StarGazer" or "CozyCloud") instead of your real name. This keeps you safe and lets you be yourself!',
    color: 'bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: Heart,
    title: 'Calming Tools',
    description: 'Find breathing exercises, gentle meditations, and calming activities whenever you need them.',
    color: 'bg-secondary/20',
    iconColor: 'text-secondary',
  },
  {
    icon: Sparkles,
    title: 'Meet Wendy',
    description: 'Wendy is your AI friend who listens without judgment and offers gentle support and insights.',
    color: 'bg-accent/30',
    iconColor: 'text-accent-foreground',
  },
  {
    icon: Shield,
    title: 'Always Here for You',
    description: 'Remember, you can use the "I Need Help" button anytime to find support from people who care.',
    color: 'bg-warm/30',
    iconColor: 'text-foreground',
  },
];

const carerSlides = [
  {
    icon: BarChart2,
    title: 'Insights & Trends',
    description: 'Track emotional patterns and understand what your child is experiencing through AI-powered insights.',
    color: 'bg-primary/20',
    iconColor: 'text-primary',
  },
  {
    icon: UserX,
    title: 'Privacy Through Nicknames',
    description: 'Both you and your child use nicknames in shared spaces. This protects identity while building trust and open communication.',
    color: 'bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: FileText,
    title: 'Shared Journal Entries',
    description: 'Read entries your child chooses to share with you. Respect their privacy and open communication.',
    color: 'bg-secondary/20',
    iconColor: 'text-secondary',
  },
  {
    icon: Users,
    title: 'Joint Activities',
    description: 'Access tools and activities designed to strengthen your bond and support emotional growth together.',
    color: 'bg-accent/30',
    iconColor: 'text-accent-foreground',
  },
  {
    icon: Shield,
    title: 'Safe & Supportive',
    description: 'Built with safeguarding at its core. Your child\'s wellbeing is monitored with care and respect.',
    color: 'bg-warm/30',
    iconColor: 'text-foreground',
  },
];

export default function QuickTour() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const slides = userRole === 'child' ? childSlides : carerSlides;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Tour complete - navigate based on role
      if (userRole === 'child') {
        navigate('/child/first-mood-checkin');
      } else {
        navigate('/carer/home');
      }
    }
  };

  const handleSkip = () => {
    if (userRole === 'child') {
      navigate('/child/first-mood-checkin');
    } else {
      navigate('/carer/home');
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="relative max-w-md w-full p-8 space-y-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
        <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
        <div className="space-y-4">
          <div className={`h-24 w-24 mx-auto rounded-full ${slide.color} flex items-center justify-center`}>
            <Icon className={`h-12 w-12 ${slide.iconColor}`} />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-interactive-accent bg-clip-text text-transparent">{slide.title}</h1>
            <p className="text-muted-foreground text-lg">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-2 justify-center">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSkip}
            variant="outline"
            className="flex-1"
          >
            Skip
          </Button>
          <Button 
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </div>
      </Card>
    </div>
  );
}