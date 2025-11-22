import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { PageLayout } from '@/components/PageLayout';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Users, 
  Brain, 
  Heart, 
  TrendingUp, 
  Shield,
  CheckCircle,
  ArrowUp,
  Lock,
  Eye,
  UserX,
  Mail,
  FileText,
  AlertCircle,
  Phone,
  HelpCircle
} from 'lucide-react';

export default function LearnMore() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg"
            size="icon"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}

        <div className="max-w-4xl mx-auto space-y-16 pt-16 pb-20">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Learn More
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Calm Connection
              </p>
            </div>
          </div>

          {/* Jump Navigation */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Quick Navigation</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'About', id: 'about' },
                  { label: 'Privacy Policy', id: 'privacy' },
                  { label: 'Terms of Use', id: 'terms' },
                  { label: 'Safeguarding', id: 'safeguarding' },
                  { label: 'Trust & Safety FAQ', id: 'faq' },
                  { label: 'Pseudonym Policy', id: 'pseudonyms' },
                  { label: 'GDPR', id: 'gdpr' }
                ].map(({ label, id }) => (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    onClick={() => scrollToSection(id)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION: About Calm Connection */}
          <section id="about" className="scroll-mt-20 space-y-8">
            <h2 className="text-4xl font-bold text-center">About Calm Connection</h2>
            
            <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
              A gentle, nurturing space where children and carers grow emotionally together
            </p>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">What Makes Us Special</h3>
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
                        <h4 className="text-xl font-bold">{feature.title}</h4>
                      </div>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center">How It Works</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="relative overflow-hidden">
                  <DecorativeIcon icon="sparkles" position="top-right" opacity={0.05} />
                  <CardContent className="p-6 space-y-4">
                    <h4 className="text-2xl font-bold text-primary">For Children</h4>
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

                <Card className="relative overflow-hidden">
                  <DecorativeIcon icon="sparkles" position="top-right" opacity={0.05} />
                  <CardContent className="p-6 space-y-4">
                    <h4 className="text-2xl font-bold text-accent">For Carers</h4>
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
          </section>

          {/* SECTION: Privacy Policy */}
          <section id="privacy" className="scroll-mt-20">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Privacy Policy</h2>
                </div>

                <p className="text-muted-foreground">Last Updated: January 2025</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      What Information Do We Collect?
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <strong className="text-foreground">About Your Child:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>A fun nickname (never their real name!)</li>
                          <li>Age range and avatar they create</li>
                          <li>Journal entries and mood check-ins</li>
                          <li>Which calming tools they use</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">About You (the Carer):</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Email address (for important updates)</li>
                          <li>Your chosen nickname</li>
                          <li>Entries you write in your own journal</li>
                        </ul>
                      </div>
                      <div className="bg-accent/50 p-3 rounded-lg">
                        <strong className="text-foreground">💜 Important:</strong>
                        <p className="mt-1">We never ask for real names, addresses, or photos. Your child's identity stays private.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Who Can See This Information?
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <strong className="text-foreground">Your Child's Journal:</strong>
                        <p className="mt-1">Only they can see it... unless they choose to share an entry with you. Their private thoughts stay private.</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Wendy (Our AI Friend):</strong>
                        <p className="mt-1">Wendy reads journal entries to spot if your child might need extra support. She's like a caring teacher who notices when a student seems upset.</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Our Safeguarding Team:</strong>
                        <p className="mt-1">If Wendy is really worried about your child's safety, we'll let you know immediately and our trained safeguarding lead (Holly) may review the entry.</p>
                      </div>
                      <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                        <strong className="text-destructive">⚠️ When We Have to Share:</strong>
                        <p className="mt-1">If we believe a child is in immediate danger, we're legally required to contact emergency services and safeguarding authorities. Your child's safety always comes first.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      How Do We Protect Data?
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✅ All data is encrypted (scrambled) so hackers can't read it</li>
                      <li>✅ Stored securely in the UK (following GDPR rules)</li>
                      <li>✅ Only essential team members can access it</li>
                      <li>✅ Regular security checks and updates</li>
                      <li>✅ No advertising or selling data to third parties. Ever.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <UserX className="h-5 w-5" />
                      Your Rights (You're in Control!)
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <strong className="text-foreground">You Can:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>See all data we hold about your family</li>
                          <li>Ask us to correct anything that's wrong</li>
                          <li>Delete your account and all data (kept for 30 days then permanently removed)</li>
                          <li>Export your child's journal entries</li>
                          <li>Change your mind about sharing entries with carers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION: Terms of Use */}
          <section id="terms" className="scroll-mt-20">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Terms of Use</h2>
                </div>

                <p className="text-muted-foreground">Plain English guide to using Calm Connection safely and responsibly</p>

                <div className="space-y-6">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6 space-y-3">
                      <h3 className="text-lg font-bold">Who Can Use Calm Connection?</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong>Children & Young People (7-16 years):</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                            <li>Under 13: Must have parent/carer permission via invite code</li>
                            <li>13-16: Can create accounts independently, but we encourage linking with a trusted adult</li>
                            <li>Must use a nickname (no real names allowed)</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Parents & Carers:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                            <li>Must be 18+ and responsible for a child using the app</li>
                            <li>Can invite children via secure codes</li>
                            <li>Can see shared journal entries and wellbeing summaries</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Critical: What Calm Connection Is NOT
                    </h3>
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-sm">
                      <strong className="text-destructive block mb-2">Calm Connection Cannot:</strong>
                      <ul className="list-disc list-inside space-y-1 text-destructive-foreground">
                        <li>Respond to emergencies or crises</li>
                        <li>Provide medical, therapeutic, or psychiatric treatment</li>
                        <li>Replace professional mental health support</li>
                        <li>Make medical diagnoses</li>
                        <li>Prescribe treatment plans</li>
                        <li>Act as a substitute for human care and supervision</li>
                      </ul>
                    </div>
                  </div>

                  <Card className="border-accent/20 bg-accent/5">
                    <CardContent className="p-6 space-y-3">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        In a Crisis? Contact These Services
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                          <div>
                            <strong>Emergency Services</strong>
                            <p className="text-xs text-muted-foreground">Immediate danger to life</p>
                          </div>
                          <a href="tel:999" className="px-4 py-2 bg-destructive text-white font-bold rounded-lg">
                            999
                          </a>
                        </div>
                        <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                          <div>
                            <strong>Childline</strong>
                            <p className="text-xs text-muted-foreground">Free, confidential support for under 19s</p>
                          </div>
                          <a href="tel:08001111" className="px-4 py-2 bg-primary text-white font-bold rounded-lg">
                            0800 1111
                          </a>
                        </div>
                        <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                          <div>
                            <strong>Samaritans</strong>
                            <p className="text-xs text-muted-foreground">24/7 listening service</p>
                          </div>
                          <a href="tel:116123" className="px-4 py-2 bg-secondary text-white font-bold rounded-lg">
                            116 123
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION: Safeguarding Information */}
          <section id="safeguarding" className="scroll-mt-20">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Safeguarding Information</h2>
                </div>

                <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                  <p className="font-bold text-destructive mb-2">🚨 IMMEDIATE DANGER</p>
                  <p className="text-sm text-destructive-foreground">
                    If a child is in immediate danger or you believe they may harm themselves or others, <strong>DO NOT wait for the app to escalate.</strong>
                  </p>
                  <div className="mt-3 flex gap-3">
                    <a href="tel:999" className="px-4 py-2 bg-destructive text-white font-bold rounded-lg text-sm">
                      Call 999
                    </a>
                    <a href="tel:08001111" className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-sm">
                      Childline 0800 1111
                    </a>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">How We Protect Children</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { title: "AI Content Monitoring", desc: "Wendy analyzes journal entries for keywords and themes indicating distress" },
                        { title: "Pattern Detection", desc: "We identify concerning trends like repeated mentions of harm or decline in mood" },
                        { title: "Human Oversight", desc: "Our Designated Safeguarding Lead reviews high-priority alerts" },
                        { title: "Immediate Notifications", desc: "Carers are alerted within minutes for urgent concerns" },
                        { title: "Privacy Protection", desc: "Only relevant safeguarding data is shared with authorized individuals" }
                      ].map((item, idx) => (
                        <Card key={idx} className="border-primary/20">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3">Escalation Tiers</h3>
                    <div className="space-y-3">
                      {[
                        { tier: "Green", label: "General Support", desc: "No immediate concern. Routine monitoring continues.", time: "No action" },
                        { tier: "Amber", label: "Moderate Concern", desc: "Concerning patterns detected (e.g., persistent low mood). Carer notified.", time: "24 hours" },
                        { tier: "Red", label: "Significant Concern", desc: "Serious content detected (e.g., mentions of self-harm). DSL reviews.", time: "1-4 hours" },
                        { tier: "Critical", label: "Immediate Risk", desc: "Imminent danger identified. Emergency services contacted if needed.", time: "Immediate" }
                      ].map((tier, idx) => (
                        <Card key={idx} className={`border-l-4 ${
                          tier.tier === "Green" ? "border-green-500" :
                          tier.tier === "Amber" ? "border-amber-500" :
                          tier.tier === "Red" ? "border-red-500" :
                          "border-destructive"
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold">{tier.tier} Tier: {tier.label}</h4>
                              <span className="text-xs font-mono px-2 py-1 bg-muted rounded">{tier.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{tier.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Card className="border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-3">Contact Our Safeguarding Lead</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> Holly</p>
                        <p><strong>Email:</strong> <a href="mailto:holly@calmconnectiongroup.com" className="text-primary hover:underline">holly@calmconnectiongroup.com</a></p>
                        <p><strong>Response Time:</strong> Usually within 24-48 hours (urgent matters prioritized)</p>
                        <p className="text-muted-foreground mt-3">For emergencies outside business hours, contact emergency services immediately.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION: Trust & Safety FAQ */}
          <section id="faq" className="scroll-mt-20">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Trust & Safety FAQ</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Privacy & Data
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          q: "Do you sell my child's data?",
                          a: "Never. We do not sell, rent, or trade any user data. We never have and never will. Your child's data is used solely to provide the app's services and ensure their safety."
                        },
                        {
                          q: "Who can see my child's journal entries?",
                          a: "Your child always has full access. You (their carer) can only see entries they choose to share. Wendy (AI) reviews all entries for safeguarding purposes, and our DSL reviews high-priority alerts only. No one else can access their private entries."
                        },
                        {
                          q: "Can I delete my child's data?",
                          a: "Yes. You can request full account deletion from Settings. All journal entries, mood data, profile information, and usage history will be deleted after a 30-day grace period. Anonymized safeguarding logs are kept for legal compliance but cannot be linked back to your child."
                        }
                      ].map((item, idx) => (
                        <Card key={idx} className="border-muted">
                          <CardContent className="p-4">
                            <h4 className="font-bold mb-2">{item.q}</h4>
                            <p className="text-sm text-muted-foreground">{item.a}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      AI & Wendy
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          q: "Is Wendy a real person?",
                          a: "No. Wendy is an AI assistant designed to listen to your child's feelings, suggest coping tools, and identify when they might need extra support. She cannot provide therapy, make diagnoses, or respond to emergencies."
                        },
                        {
                          q: "Can Wendy make mistakes?",
                          a: "Yes. Like any AI, Wendy can misinterpret language. That's why a human Designated Safeguarding Lead reviews high-priority alerts, and we encourage you to monitor your child's wellbeing independently."
                        }
                      ].map((item, idx) => (
                        <Card key={idx} className="border-muted">
                          <CardContent className="p-4">
                            <h4 className="font-bold mb-2">{item.q}</h4>
                            <p className="text-sm text-muted-foreground">{item.a}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION: Pseudonym Policy */}
          <section id="pseudonyms" className="scroll-mt-20">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <UserX className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Pseudonym Policy</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Privacy First: Why Pseudonyms?</h3>
                    <p className="text-sm text-muted-foreground">
                      We require nicknames (pseudonyms) instead of real names to protect your child's identity in case of data breaches, accidental sharing, or unauthorized device access.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3">Safe Nickname Examples</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-green-500/50 bg-green-500/5">
                        <CardContent className="p-4">
                          <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">✅ Good Examples</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• StarGazer123</li>
                            <li>• OceanDreamer</li>
                            <li>• BookwormKid</li>
                            <li>• SunnySmiles</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/50 bg-red-500/5">
                        <CardContent className="p-4">
                          <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Not Allowed</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Full real names</li>
                            <li>• Email addresses</li>
                            <li>• Phone numbers</li>
                            <li>• Home addresses</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3">How We Enforce This</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our system checks nicknames against common names databases and flags suspicious entries. If real information is detected, we'll ask you to choose a different nickname.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION: GDPR Compliance */}
          <section id="gdpr" className="scroll-mt-20">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">GDPR Compliance</h2>
                </div>

                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Calm Connection fully complies with UK GDPR and the ICO's Age Appropriate Design Code to protect children's data.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3">Your Data Rights</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✅ Right to access your data</li>
                          <li>✅ Right to correct inaccurate data</li>
                          <li>✅ Right to delete your data</li>
                          <li>✅ Right to export your data</li>
                          <li>✅ Right to withdraw consent</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3">Our Commitments</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✅ Privacy by design and default</li>
                          <li>✅ Parental consent for under-13s</li>
                          <li>✅ Clear, age-appropriate information</li>
                          <li>✅ Data minimization</li>
                          <li>✅ Regular security audits</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-accent/20">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-3">Data Retention</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Active account data is retained as long as your account is active. Upon account deletion:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 30-day grace period to restore account</li>
                        <li>• After 30 days: All personal data permanently deleted</li>
                        <li>• Anonymized safeguarding logs retained for legal compliance (cannot be linked to individuals)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <Card className="border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Still Have Questions?</h2>
              <p className="text-muted-foreground">
                Contact our Designated Safeguarding Lead for any concerns about safety, privacy, or data protection.
              </p>
              <div className="bg-primary/10 p-6 rounded-lg">
                <p className="font-bold">Holly</p>
                <a href="mailto:holly@calmconnectiongroup.com" className="text-primary hover:underline">
                  holly@calmconnectiongroup.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">Response time: Usually within 24-48 hours</p>
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
