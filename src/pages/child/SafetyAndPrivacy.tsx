import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Heart, Shield, Star, Phone } from 'lucide-react';

export default function SafetyAndPrivacy() {
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6 pb-20 px-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Your Privacy 🔒</h1>
          <p className="text-muted-foreground">
            How we keep you safe and your journal private
          </p>
        </div>

        {/* Your Journal is Private */}
        <Card className="border-primary">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Your Journal is Private 📖</CardTitle>
            <CardDescription>Only you can see your journal entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <p className="text-sm text-foreground font-medium">Who can see your journal?</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>👤</span>
                  <span><strong>You</strong> - Always! It's yours.</span>
                </li>
                <li className="flex gap-2">
                  <span>👨‍👩‍👧</span>
                  <span><strong>Your grown-up</strong> - Only if you choose to share</span>
                </li>
                <li className="flex gap-2">
                  <span>🤖</span>
                  <span><strong>Wendy</strong> - She reads to help keep you safe</span>
                </li>
                <li className="flex gap-2">
                  <span>❌</span>
                  <span><strong>Nobody else!</strong> Not your friends, not your teachers</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              You get to decide which entries to share with your grown-up. If you don't share it, 
              they can't see it!
            </p>
          </CardContent>
        </Card>

        {/* We Never Sell Your Data */}
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-foreground">We Never Sell Your Data. Ever. 💚</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Your journal, your feelings, and your information are <strong>NOT FOR SALE</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              We don't sell it to companies. We don't give it to advertisers. We don't share it 
              with strangers. Your stuff is YOUR stuff!
            </p>
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm font-medium text-foreground">What we DO use it for:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Making Wendy smarter so she can help you</li>
                <li>Keeping you safe if you're worried or upset</li>
                <li>Showing your grown-up insights (only if you share)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Choose a Fun Nickname */}
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <CardTitle className="text-foreground">Choose a Fun Nickname! ✨</CardTitle>
            <CardDescription>You don't need to use your real name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You get to pick a cool nickname instead of using your real name. This keeps you 
              extra safe!
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Good nickname ideas:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">CalmOtter</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">SkyHopper</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">GentlePanda</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">CozyCloud</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You can change your nickname anytime in Settings!
            </p>
          </CardContent>
        </Card>

        {/* Talk to a Grown-Up */}
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-2">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <CardTitle className="text-foreground">Talk to a Grown-Up 💬</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Calm Connection is here to help, but it's always good to talk to a real person too!
            </p>
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">If you feel worried or scared:</p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Talk to your parent or carer</li>
                <li>Talk to your teacher</li>
                <li>Talk to another trusted adult</li>
                <li>Call Childline: 0800 1111 (it's free!)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Help */}
        <Card className="border-destructive">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <Phone className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-foreground">If You Need Help Right Now 🚨</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you're in danger or really need help:
            </p>
            <div className="space-y-2">
              <div className="bg-destructive/5 p-3 rounded-lg">
                <p className="font-bold text-destructive">Call 999</p>
                <p className="text-xs text-muted-foreground">For emergencies (police, ambulance, fire)</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="font-bold text-foreground">Call Childline: 0800 1111</p>
                <p className="text-xs text-muted-foreground">Talk to someone anytime, day or night</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Wendy can't help with emergencies because she's not a real person. 
              Always tell a grown-up or call for help!
            </p>
          </CardContent>
        </Card>

        {/* Want to Know More? */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Have more questions? Ask your grown-up to read our grown-up policies!
          </p>
          <Button variant="outline" asChild>
            <Link to="/carer/policy-hub">Grown-Up Info</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
