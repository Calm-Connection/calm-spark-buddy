import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { PageLayout } from '@/components/PageLayout';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { Footer } from '@/components/Footer';
import { 
  Sparkles, 
  Users, 
  Brain, 
  Heart, 
  TrendingUp, 
  Shield,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "Safe Creative Expression",
      description: "Journal with text, drawing, or voice - express yourself in the way that feels right for you."
    },
    {
      icon: Users,
      title: "Trusted Connection",
      description: "Secure carer-child linking with full privacy controls. Share what you want, when you want."
    },
    {
      icon: Brain,
      title: "Calming Tools",
      description: "Breathing exercises, grounding games, and gentle reflections to help when things feel tough."
    },
    {
      icon: Heart,
      title: "AI Support (Wendy)",
      description: "Gentle emotional guidance from Wendy, our friendly AI companion who's always here to listen."
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Mood check-ins and achievements that celebrate your emotional journey."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "GDPR compliant with safeguarding principles. Use pseudonyms if you prefer."
    }
  ];

  return (
    <PageLayout showLogo={false}>
      <div className="relative">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 z-20"
        >
          ← Back to Welcome
        </Button>

        <div className="max-w-4xl mx-auto space-y-12 pt-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                About Calm Connection
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A gentle, nurturing space where children and carers grow emotionally together
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">What Makes Us Special</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <DecorativeIcon 
                    icon={feature.icon === Sparkles ? "sparkles" : "leaf"} 
                    position="top-right" 
                    opacity={0.05} 
                  />
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">How It Works</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* For Children */}
              <Card className="relative overflow-hidden">
                <DecorativeIcon icon="heart" position="top-right" opacity={0.05} />
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-primary">For Children</h3>
                  <div className="space-y-3">
                    {[
                      "Sign up with a safe nickname",
                      "Create your unique avatar",
                      "Start journaling your feelings",
                      "Use calming tools when you need them",
                      "Share entries with your carer (optional)"
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* For Carers */}
              <Card className="relative overflow-hidden">
                <DecorativeIcon icon="sparkles" position="top-right" opacity={0.05} />
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-accent">For Carers</h3>
                  <div className="space-y-3">
                    {[
                      "Sign up and create your profile",
                      "Generate an invite code",
                      "Share the code with your child",
                      "View shared journal entries",
                      "Support their emotional journey"
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Safety & Privacy */}
          <Card className="relative overflow-hidden">
            <DecorativeIcon icon="shield" position="bottom-right" opacity={0.05} />
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Safety & Privacy</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Your Data is Protected</h3>
                  <p className="text-muted-foreground">
                    We follow GDPR guidelines to ensure your privacy. You can export or delete your data at any time.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Safeguarding First</h3>
                  <p className="text-muted-foreground">
                    AI-powered safeguarding monitors for concerning content while respecting your privacy.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Pseudonyms Welcome</h3>
                  <p className="text-muted-foreground">
                    Use a nickname instead of your real name for an extra layer of privacy.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">You're in Control</h3>
                  <p className="text-muted-foreground">
                    Choose what to share with your carer. Every journal entry is yours to control.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/carer/privacy-policy')}
                >
                  Privacy Policy <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/carer/terms-of-use')}
                >
                  Terms of Use <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/carer/safeguarding-info')}
                >
                  Safeguarding Info <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center space-y-6 py-8">
            <h2 className="text-3xl font-bold">Ready to Begin?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join Calm Connection today and start your journey toward emotional wellbeing.
            </p>
            <Button 
              onClick={() => navigate('/role-selection')}
              variant="gradient"
              size="lg"
              className="hover:scale-105 transition-all"
            >
              Get Started Now
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </PageLayout>
  );
}
