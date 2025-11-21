import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/PageLayout';
import { Shield, Lock, Eye, UserX, Mail, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const [version, setVersion] = useState<'legal' | 'friendly'>('friendly');
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Your Privacy Matters
            </CardTitle>
            <CardDescription>
              How we protect your family's information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={version} onValueChange={(v) => setVersion(v as 'legal' | 'friendly')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="friendly">Parent-Friendly Version</TabsTrigger>
                <TabsTrigger value="legal">Full Legal Version</TabsTrigger>
              </TabsList>

              <TabsContent value="friendly" className="space-y-6 mt-6">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    🌟 Welcome! Here's What You Need to Know
                  </h3>
                  <p className="text-muted-foreground">
                    We've written this in plain English so you can understand exactly how we keep your family safe online.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        What Information Do We Collect?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <strong>About Your Child:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                          <li>A fun nickname (never their real name!)</li>
                          <li>Age range and avatar they create</li>
                          <li>Journal entries and mood check-ins</li>
                          <li>Which calming tools they use</li>
                        </ul>
                      </div>
                      <div>
                        <strong>About You (the Carer):</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                          <li>Email address (for important updates)</li>
                          <li>Your chosen nickname</li>
                          <li>Entries you write in your own journal</li>
                        </ul>
                      </div>
                      <div className="bg-accent/50 p-3 rounded-lg">
                        <strong className="text-accent-foreground">💜 Important:</strong>
                        <p className="text-sm mt-1">We never ask for real names, addresses, or photos. Your child's identity stays private.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Who Can See This Information?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <strong>Your Child's Journal:</strong>
                        <p className="text-muted-foreground mt-1">Only they can see it... unless they choose to share an entry with you. Their private thoughts stay private.</p>
                      </div>
                      <div>
                        <strong>Wendy (Our AI Friend):</strong>
                        <p className="text-muted-foreground mt-1">Wendy reads journal entries to spot if your child might need extra support. She's like a caring teacher who notices when a student seems upset.</p>
                      </div>
                      <div>
                        <strong>Our Safeguarding Team:</strong>
                        <p className="text-muted-foreground mt-1">If Wendy is really worried about your child's safety, we'll let you know immediately and our trained safeguarding lead (Holly) may review the entry.</p>
                      </div>
                      <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                        <strong className="text-destructive">⚠️ When We Have to Share:</strong>
                        <p className="text-sm mt-1">If we believe a child is in immediate danger, we're legally required to contact emergency services and safeguarding authorities. Your child's safety always comes first.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        How Do We Protect Data?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <ul className="space-y-2 text-muted-foreground">
                        <li>✅ All data is encrypted (scrambled) so hackers can't read it</li>
                        <li>✅ Stored securely in the UK (following GDPR rules)</li>
                        <li>✅ Only essential team members can access it</li>
                        <li>✅ Regular security checks and updates</li>
                        <li>✅ No advertising or selling data to third parties. Ever.</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <UserX className="h-5 w-5" />
                        Your Rights (You're in Control!)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <strong>You Can:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                          <li>See all data we hold about your family</li>
                          <li>Ask us to correct anything that's wrong</li>
                          <li>Delete your account and all data (kept for 30 days then permanently removed)</li>
                          <li>Export your child's journal entries</li>
                          <li>Change your mind about sharing entries with carers</li>
                        </ul>
                      </div>
                      <p className="text-muted-foreground">Just go to Settings → Legal & Privacy to manage your data.</p>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Questions? We're Here to Help
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="text-muted-foreground mb-3">
                        Our Designated Safeguarding Lead is Holly, and she's happy to answer any questions about privacy or safeguarding.
                      </p>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <strong>📧 Email:</strong> holly@calmconnectiongroup.com<br />
                        <strong>📍 Address:</strong> Calm Connection, UK<br />
                        <strong>⏰ Response time:</strong> Usually within 24 hours
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="legal" className="space-y-6 mt-6">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold">Calm Connection Privacy Policy</h3>
                  <p className="text-muted-foreground text-sm">Last Updated: January 2025</p>
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="intro" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      1. Introduction & Data Controller
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3 text-muted-foreground">
                      <p>
                        Calm Connection ("we", "us", "our") is committed to protecting the privacy and security of personal data, particularly for children and young people aged 7-16.
                      </p>
                      <p>
                        <strong>Data Controller:</strong> Calm Connection Group<br />
                        <strong>Designated Safeguarding Lead:</strong> Holly<br />
                        <strong>Contact:</strong> holly@calmconnectiongroup.com
                      </p>
                      <p>
                        This Privacy Policy explains how we collect, use, store, and protect personal data in compliance with:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>UK General Data Protection Regulation (UK GDPR)</li>
                        <li>Data Protection Act 2018</li>
                        <li>ICO Children's Code (Age Appropriate Design Code)</li>
                        <li>Children Act 1989 & 2004</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="collection" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      2. Information We Collect
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-4 text-muted-foreground">
                      <div>
                        <strong className="text-foreground">2.1 Child User Data:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Pseudonym (nickname) - real names are prohibited</li>
                          <li>Age range category (7-10, 11-13, 14-16)</li>
                          <li>Gender (optional)</li>
                          <li>Custom avatar data (no photos)</li>
                          <li>Journal entries (text, voice recordings, drawings)</li>
                          <li>Mood check-in data</li>
                          <li>Tool usage statistics (breathing exercises, calming activities)</li>
                          <li>Interaction with AI support (Wendy)</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">2.2 Parent/Carer Data:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Email address (for authentication and alerts)</li>
                          <li>Pseudonym (nickname)</li>
                          <li>Custom avatar data</li>
                          <li>Personal journal entries</li>
                          <li>Notification preferences</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">2.3 Technical Data:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Device type and browser</li>
                          <li>IP address (anonymized)</li>
                          <li>Usage timestamps</li>
                          <li>Error logs (anonymized)</li>
                        </ul>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <strong className="text-foreground">No Real Names Policy:</strong>
                        <p className="mt-1">We actively enforce pseudonymisation. Real names, addresses, phone numbers, and photos are prohibited and filtered by our systems.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="usage" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      3. How We Use Your Information
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-4 text-muted-foreground">
                      <div>
                        <strong className="text-foreground">3.1 Primary Purposes:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Provide emotional wellbeing support tools and resources</li>
                          <li>Enable secure journal writing and mood tracking</li>
                          <li>Generate AI-powered insights (Wendy) to identify support needs</li>
                          <li>Facilitate safe communication between children and trusted carers</li>
                          <li>Monitor for safeguarding concerns and child protection issues</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">3.2 Safeguarding & Legal Obligations:</strong>
                        <p className="mt-2">
                          Under UK law, we have a duty of care to protect children. If our AI analysis or manual review identifies content indicating:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Immediate risk of harm to self or others</li>
                          <li>Abuse, neglect, or exploitation</li>
                          <li>Criminal activity</li>
                        </ul>
                        <p className="mt-2">
                          We will escalate to our Designated Safeguarding Lead and, where legally required, to local authorities, police, or emergency services.
                        </p>
                      </div>
                      <div>
                        <strong className="text-foreground">3.3 AI Processing (Wendy):</strong>
                        <p className="mt-2">
                          Journal entries are analyzed by Google Gemini AI to detect emotional themes, risk levels, and recommend coping strategies. This processing happens in real-time and results are stored for pattern analysis.
                        </p>
                      </div>
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <strong className="text-foreground">We Never:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Sell or rent personal data to third parties</li>
                          <li>Use data for advertising or marketing</li>
                          <li>Share data with social media platforms</li>
                          <li>Train public AI models with your child's entries</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="sharing" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      4. Data Sharing & Disclosure
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-4 text-muted-foreground">
                      <div>
                        <strong className="text-foreground">4.1 Within the App:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Children control which journal entries are shared with their linked carer</li>
                          <li>Carers can only see entries explicitly marked "Share with carer"</li>
                          <li>Mood trends and tool usage summaries may be visible to carers</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">4.2 Safeguarding Disclosures:</strong>
                        <p className="mt-2">
                          When risk is identified, we may share relevant information with:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Designated Safeguarding Lead (internal review)</li>
                          <li>Linked parent/carer (immediate notification)</li>
                          <li>Local Authority Safeguarding Teams (high risk)</li>
                          <li>Police / Emergency Services (imminent danger)</li>
                          <li>Multi-Agency Safeguarding Hub (MASH) when appropriate</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">4.3 Service Providers:</strong>
                        <p className="mt-2">We use trusted third-party services:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li><strong>Supabase (Database & Auth):</strong> UK/EU data centers, GDPR compliant</li>
                          <li><strong>Google AI (Gemini):</strong> Journal analysis only, no training on our data</li>
                          <li><strong>Resend (Email):</strong> Transactional emails only (alerts, verification)</li>
                        </ul>
                        <p className="mt-2">All providers are bound by Data Processing Agreements (DPAs) and cannot use our data for their own purposes.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="storage" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      5. Data Storage & Security
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-4 text-muted-foreground">
                      <div>
                        <strong className="text-foreground">5.1 Storage Location:</strong>
                        <p className="mt-2">All personal data is stored within the UK/EU on servers provided by Supabase (AWS infrastructure). Data does not leave the UK/EU.</p>
                      </div>
                      <div>
                        <strong className="text-foreground">5.2 Security Measures:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
                          <li>Row-Level Security (RLS) policies enforced at database level</li>
                          <li>Regular security audits and penetration testing</li>
                          <li>Multi-factor authentication for admin access</li>
                          <li>Automated backup and disaster recovery</li>
                          <li>Content moderation filters for inappropriate material</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">5.3 Retention Periods:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li><strong>Active accounts:</strong> Data retained while account is active</li>
                          <li><strong>Deleted accounts:</strong> 30-day grace period, then permanent deletion</li>
                          <li><strong>Safeguarding logs:</strong> Retained for 7 years (legal requirement)</li>
                          <li><strong>Anonymized analytics:</strong> Indefinitely (no personal identifiers)</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="rights" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      6. Your Rights Under GDPR
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-4 text-muted-foreground">
                      <div>
                        <strong className="text-foreground">You Have the Right To:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                          <li><strong>Access:</strong> Request a copy of all data we hold (via Settings → Export Data)</li>
                          <li><strong>Rectification:</strong> Correct inaccurate information</li>
                          <li><strong>Erasure:</strong> Delete your account and all associated data (30-day retention)</li>
                          <li><strong>Portability:</strong> Receive data in machine-readable format (JSON export)</li>
                          <li><strong>Restriction:</strong> Limit how we process data (e.g., pause AI analysis)</li>
                          <li><strong>Objection:</strong> Object to automated decision-making</li>
                          <li><strong>Withdraw Consent:</strong> Stop using the service at any time</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">For Children Under 13:</strong>
                        <p className="mt-2">
                          Parental consent is required. Parents can exercise all rights on behalf of their child and have additional oversight through the carer account.
                        </p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <strong className="text-foreground">Exercise Your Rights:</strong>
                        <p className="mt-1">Contact holly@calmconnectiongroup.com or use Settings → Legal & Privacy in the app.</p>
                        <p className="mt-1">We respond within 1 month (may extend to 3 months for complex requests).</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="children" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      7. Children's Privacy (ICO Code Compliance)
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-4 text-muted-foreground">
                      <div>
                        <strong className="text-foreground">We Follow the ICO Children's Code:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>✅ Best interests of the child are paramount</li>
                          <li>✅ Age-appropriate language and design</li>
                          <li>✅ Transparency about data use (this policy + in-app explanations)</li>
                          <li>✅ Privacy by default (strictest settings automatically applied)</li>
                          <li>✅ Minimal data collection (only what's needed for wellbeing support)</li>
                          <li>✅ No profiling or automated marketing</li>
                          <li>✅ No location tracking or geolocation features</li>
                          <li>✅ Parental controls and consent mechanisms</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground">Parental Consent:</strong>
                        <p className="mt-2">
                          Children under 13 require parental consent via the invite code system. The parent/carer must:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Create a carer account and verify their email</li>
                          <li>Generate an invite code for their child</li>
                          <li>Review and accept this Privacy Policy and Terms of Use</li>
                        </ul>
                        <p className="mt-2">Children 13+ may create accounts independently but are encouraged to link with a trusted adult.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cookies" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      8. Cookies & Tracking
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3 text-muted-foreground">
                      <p>
                        We use minimal cookies:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><strong>Essential:</strong> Authentication session (required for login)</li>
                        <li><strong>Functional:</strong> Theme preferences, notification settings</li>
                      </ul>
                      <p className="mt-3">
                        <strong className="text-foreground">We Do NOT Use:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Advertising cookies</li>
                        <li>Third-party tracking pixels</li>
                        <li>Social media integrations</li>
                        <li>Analytics that identify individuals</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="changes" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      9. Changes to This Policy
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-3 text-muted-foreground">
                      <p>
                        We may update this Privacy Policy to reflect changes in:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>UK/EU data protection law</li>
                        <li>Our services and features</li>
                        <li>Safeguarding best practices</li>
                      </ul>
                      <p className="mt-3">
                        <strong className="text-foreground">Notification of Changes:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Material changes: Email notification + in-app alert</li>
                        <li>Minor updates: Updated "Last Modified" date at top of policy</li>
                        <li>Annual review: We review this policy every 12 months minimum</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="contact" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold">
                      10. Contact & Complaints
                    </AccordionTrigger>
                    <AccordionContent className="text-sm space-y-4 text-muted-foreground">
                      <div>
                        <strong className="text-foreground">Privacy Questions:</strong>
                        <div className="bg-primary/10 p-3 rounded-lg mt-2">
                          <p><strong>Designated Safeguarding Lead:</strong> Holly</p>
                          <p><strong>Email:</strong> holly@calmconnectiongroup.com</p>
                          <p><strong>Response time:</strong> Within 24 hours (weekdays)</p>
                        </div>
                      </div>
                      <div>
                        <strong className="text-foreground">Complaints:</strong>
                        <p className="mt-2">
                          If you're unhappy with how we've handled your data, you can complain to:
                        </p>
                        <div className="bg-secondary/10 p-3 rounded-lg mt-2">
                          <p><strong>Information Commissioner's Office (ICO)</strong></p>
                          <p>Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</p>
                          <p>Tel: 0303 123 1113</p>
                          <p>Website: <a href="https://ico.org.uk" className="text-primary hover:underline">ico.org.uk</a></p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="bg-primary/10 p-4 rounded-lg text-sm">
                  <p className="font-semibold">Document Information:</p>
                  <p className="text-muted-foreground">Last Updated: January 2025</p>
                  <p className="text-muted-foreground">Version: 2.0</p>
                  <p className="text-muted-foreground">Next Review: January 2026</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-accent/20 border-accent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Related Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = '/carer/terms-of-use'}>
              → Terms of Use
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = '/carer/safeguarding-info'}>
              → Safeguarding Information
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = '/carer/pseudonym-policy'}>
              → Pseudonym & No Real Names Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = '/carer/trust-safety-faq'}>
              → Trust & Safety FAQs
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
