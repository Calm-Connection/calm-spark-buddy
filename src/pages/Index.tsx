import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Shield, Sparkles, Users } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && userRole) {
      // Redirect authenticated users to their home
      if (userRole === 'child') {
        navigate('/child/home');
      } else if (userRole === 'carer') {
        navigate('/carer/home');
      }
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            Calm Connection
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            A safe, supportive space for children's mental wellbeing and parent connection
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate('/welcome')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Private Journal</h3>
            <p className="text-muted-foreground">
              Express your feelings in a safe, judgment-free space. Share with your carer when you're ready.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Wendy AI Support</h3>
            <p className="text-muted-foreground">
              Chat with Wendy, your friendly AI companion who's always here to listen and help.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Built-in Safety</h3>
            <p className="text-muted-foreground">
              Intelligent safeguarding features that connect you with professional help when needed.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Parent Connection</h3>
            <p className="text-muted-foreground">
              Carers can support their children while respecting privacy and boundaries.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4 bg-primary/5 rounded-lg p-8">
          <h2 className="text-3xl font-bold">Ready to start your journey?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join Calm Connection today and discover a supportive community for mental wellbeing.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/welcome')}
            className="bg-primary hover:bg-primary/90"
          >
            Begin Now
          </Button>
        </div>
      </div>
    </div>
  );
}
