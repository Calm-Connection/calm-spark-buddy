import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Sparkles, Compass, Users, Shield, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: Heart,
    title: "You're already doing enough 💜",
    body: "The fact that you're here says everything.\nParenting through tough moments is hard.\nYou don't need to have it all figured out.",
    cta: "Keep going",
    colorClass: "text-primary"
  },
  {
    icon: Sparkles,
    title: "This isn't about fixing anyone",
    body: "There's nothing wrong with your child.\nThis app is about connection, not correction.\nSmall moments of understanding can make a big difference.",
    cta: "I like that",
    colorClass: "text-secondary"
  },
  {
    icon: Compass,
    title: "There's no right way to use this",
    body: "Skip what doesn't feel right.\nCome back when you're ready.\nThis is your space, at your pace.",
    cta: "That helps",
    colorClass: "text-accent"
  },
  {
    icon: Users,
    title: "You're not alone in this",
    body: "Many parents feel the same way you do right now.\nIt's okay to feel unsure.\nWe're here to walk alongside you — not to tell you what to do.",
    cta: "Thank you",
    colorClass: "text-warm"
  },
  {
    icon: Shield,
    title: "A gentle note before we begin",
    body: "Calm Connection offers gentle support and calming tools.\nIt's not therapy, and it's not medical advice.\nIf your child is in crisis, please reach out to a professional.",
    cta: "I understand, let's begin",
    colorClass: "text-interactive-accent"
  }
];

export default function ParentOnboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const IconComponent = slide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      navigate('/carer/invite-code');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    navigate('/carer/invite-code');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background">
      <Card className="relative max-w-md w-full p-6 sm:p-8 md:p-10 space-y-8 overflow-hidden">
        {/* Decorative background glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none`} />
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-primary' 
                  : index < currentSlide 
                    ? 'w-2 bg-primary/50' 
                    : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className={`p-4 rounded-full bg-muted/50 ${slide.colorClass}`}>
            <IconComponent className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {slide.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
            {slide.body}
          </p>
        </div>

        {/* CTA Button */}
        <div className="space-y-3">
          <Button 
            onClick={handleNext}
            className="w-full h-12 text-base font-medium gap-2"
            size="lg"
          >
            {slide.cta}
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {!isLastSlide && (
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
