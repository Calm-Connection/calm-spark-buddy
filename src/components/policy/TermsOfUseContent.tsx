import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle, Phone, Heart, Shield } from 'lucide-react';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';

export function TermsOfUseContent() {
  return (
    <div className="space-y-6">
      {/* Emergency Disclaimer at Top */}
      <DisclaimerCard variant="emergency" size="large" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-primary" />
            Terms of Use
          </CardTitle>
          <CardDescription>
            Plain English guide to using Calm Connection safely and responsibly
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none space-y-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              👋 Welcome to Calm Connection
            </h3>
            <p className="text-muted-foreground">
              These Terms of Use explain what Calm Connection is, how to use it safely, and what we expect from each other. We've written this in clear language so everyone can understand.
            </p>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Who Can Use Calm Connection?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-5 w-5" />
                What Calm Connection Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong>Calm Connection is a wellbeing support tool, not a medical service.</strong> We provide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Private journaling:</strong> A safe space to express feelings</li>
                <li><strong>AI support (Wendy):</strong> Friendly AI that suggests coping strategies</li>
                <li><strong>Calming tools:</strong> Breathing exercises, mood tracking, and relaxation activities</li>
                <li><strong>Carer insights:</strong> Wellbeing summaries for parents (with child consent)</li>
                <li><strong>Safeguarding monitoring:</strong> We watch for signs a child needs extra help</li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Critical: What Calm Connection Is NOT
            </h3>
            <DisclaimerCard variant="ai-limitation" size="medium" />
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
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-5 w-5" />
                In a Crisis? Contact These Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
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
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety & Respect: Our Community Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Everyone Must:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Use a nickname (no real names, addresses, or phone numbers)</li>
                  <li>Be kind and respectful in all interactions</li>
                  <li>Keep personal information private</li>
                  <li>Report concerns about safety or inappropriate content</li>
                  <li>Follow UK laws (including Computer Misuse Act, Communications Act)</li>
                </ul>
              </div>
              <div>
                <strong>Prohibited Activities:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-destructive">
                  <li>Sharing others' private information without permission</li>
                  <li>Bullying, harassment, or threatening behavior</li>
                  <li>Impersonating someone else</li>
                  <li>Attempting to hack or abuse the system</li>
                  <li>Using the app for illegal activities</li>
                  <li>Creating multiple accounts to evade restrictions</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                <strong>Consequences:</strong>
                <p className="mt-1 text-muted-foreground">
                  Violating these rules may result in account suspension or termination. Serious violations will be reported to appropriate authorities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-base">Your Content & Our Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Ownership:</strong>
                <p className="text-muted-foreground mt-1">
                  You own your journal entries, drawings, and content. We never claim ownership of what you create.
                </p>
              </div>
              <div>
                <strong>What We Can Do:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Analyze entries with AI (Wendy) to provide support and monitor wellbeing</li>
                  <li>Store your content securely on our servers</li>
                  <li>Share safeguarding concerns with your carer and authorities if required</li>
                  <li>Remove content that violates these Terms or UK law</li>
                </ul>
              </div>
              <div>
                <strong>What We Never Do:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Sell or license your content to third parties</li>
                  <li>Use your content for advertising</li>
                  <li>Share your entries publicly</li>
                  <li>Train public AI models with your data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-base">Parent/Carer Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>If you're a parent or carer, you agree to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Supervise your child's use of the app appropriately for their age</li>
                <li>Respond promptly to wellbeing alerts (within 24 hours)</li>
                <li>Seek professional help if recommended by our safeguarding team</li>
                <li>Not access your child's private entries without permission</li>
                <li>Maintain open communication with your child about their wellbeing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Safeguarding & Legal Obligations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong>We take child safety seriously.</strong> Under UK law (Children Act 1989/2004), we have a duty to protect children from harm.
              </p>
              <div>
                <strong>We Will Report:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Immediate risk of harm to self or others</li>
                  <li>Signs of abuse, neglect, or exploitation</li>
                  <li>Criminal activity involving children</li>
                </ul>
              </div>
              <div>
                <strong>Escalation Process:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li><strong>Green Tier:</strong> General support, no escalation needed</li>
                  <li><strong>Amber Tier:</strong> Concerning patterns, carer notified within 24 hours</li>
                  <li><strong>Red Tier:</strong> Serious concern, immediate carer alert + DSL review</li>
                  <li><strong>Critical:</strong> Imminent danger, emergency services contacted</li>
                </ul>
              </div>
              <p className="text-sm bg-primary/10 p-3 rounded-lg">
                <strong>Designated Safeguarding Lead:</strong> Holly<br />
                <strong>Contact:</strong> holly@calmconnectiongroup.com
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-base">Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>You Can:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Delete your account at any time via Settings</li>
                  <li>Export your data before deletion</li>
                  <li>Request immediate deletion (30-day retention period)</li>
                </ul>
              </div>
              <div>
                <strong>We May Suspend/Terminate If:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>You violate these Terms of Use</li>
                  <li>You engage in illegal activity</li>
                  <li>Your account poses a security risk</li>
                  <li>Required by law or safeguarding concerns</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                We'll notify you before termination unless legally prohibited or urgent safeguarding reasons apply.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-base">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Calm Connection provides wellbeing support tools but cannot guarantee outcomes.</strong> To the fullest extent permitted by UK law:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>We are not liable for the effectiveness of suggested coping strategies</li>
                <li>We cannot be held responsible for crisis events between check-ins</li>
                <li>We are not responsible for third-party services (Childline, Samaritans, etc.)</li>
                <li>Technical errors or service interruptions may occur</li>
              </ul>
              <p className="mt-3">
                <strong>Nothing in these Terms affects your statutory rights as a consumer under UK law.</strong>
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We may update these Terms to reflect changes in law or our services. If we make material changes:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>We'll email you at least 30 days before changes take effect</li>
                <li>We'll display an in-app notification</li>
                <li>Continued use after changes means you accept the new Terms</li>
              </ul>
              <p className="mt-3">
                <strong>Last Updated:</strong> January 2025<br />
                <strong>Version:</strong> 2.0
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-base">Contact & Complaints</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground mb-3">
                Questions about these Terms? Need to report a concern?
              </p>
              <div className="bg-primary/10 p-4 rounded-lg space-y-1">
                <p><strong>Designated Safeguarding Lead:</strong> Holly</p>
                <p><strong>Email:</strong> holly@calmconnectiongroup.com</p>
                <p><strong>Response time:</strong> Within 24-48 hours</p>
              </div>
              <p className="text-muted-foreground mt-4 text-xs">
                <strong>Governing Law:</strong> These Terms are governed by the laws of England and Wales. Any disputes will be handled in UK courts.
              </p>
            </CardContent>
          </Card>

          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="font-semibold">By using Calm Connection, you agree to these Terms of Use.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Thank you for being part of our community. Together, we can support children's wellbeing. 💜
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
