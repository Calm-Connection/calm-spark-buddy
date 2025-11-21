import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, FileText, Shield, UserX, HelpCircle, Mail } from 'lucide-react';

export default function PolicyHub() {
  const policies = [
    {
      icon: Lock,
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data',
      path: '/carer/privacy-policy',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: FileText,
      title: 'Terms of Use',
      description: 'What you agree to when using Calm Connection',
      path: '/carer/terms-of-use',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Shield,
      title: 'Safeguarding Information',
      description: 'How we protect your child and respond to concerns',
      path: '/carer/safeguarding-info',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: UserX,
      title: 'Pseudonym Policy',
      description: 'Why we use nicknames instead of real names',
      path: '/carer/pseudonym-policy',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: HelpCircle,
      title: 'Trust & Safety FAQs',
      description: 'Answers to common questions about privacy and safety',
      path: '/carer/trust-safety-faq',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Policies & Information</h1>
          <p className="text-muted-foreground mt-2">
            Everything you need to know about privacy, safety, and your rights
          </p>
        </div>

        {/* Policy Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <Link key={policy.path} to={policy.path}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${policy.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`h-6 w-6 ${policy.color}`} />
                    </div>
                    <CardTitle className="text-foreground">{policy.title}</CardTitle>
                    <CardDescription>{policy.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Contact DSL */}
        <Card className="border-primary mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Have Questions or Concerns?
            </CardTitle>
            <CardDescription>
              Contact our Designated Safeguarding Lead
            </CardDescription>
            <div className="pt-2">
              <a 
                href="mailto:holly@calmconnectiongroup.com"
                className="text-primary hover:underline font-medium"
              >
                holly@calmconnectiongroup.com
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Response time: Within 4 hours during business hours (Mon-Fri, 9am-5pm)
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Info */}
        <div className="bg-muted/30 p-6 rounded-lg space-y-2">
          <h3 className="font-semibold text-foreground">Quick Facts</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>We never sell your data</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>We're fully GDPR and ICO Children's Code compliant</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>All data is encrypted and stored securely in the UK</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>You can delete your data anytime (30-day grace period)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Safeguarding monitoring happens 24/7 (human review during business hours)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Wendy is AI, not a therapist - this is support, not treatment</span>
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
