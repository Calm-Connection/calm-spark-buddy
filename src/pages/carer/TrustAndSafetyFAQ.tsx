import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, ArrowLeft, Shield, Lock, Heart, AlertTriangle } from 'lucide-react';

export default function TrustAndSafetyFAQ() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-8 w-8 text-primary" />
              Trust & Safety FAQs
            </h1>
            <p className="text-muted-foreground mt-1">Common questions about safety and privacy</p>
          </div>
        </div>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Privacy & Data
            </CardTitle>
            <CardDescription>How we protect your information</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What data do you collect?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We collect:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Email address (for carers only, for account creation)</li>
                    <li>Nicknames/pseudonyms (NOT real names)</li>
                    <li>Journal entries and mood check-ins</li>
                    <li>Tool usage data (which calming tools were used)</li>
                    <li>Device information (for technical support)</li>
                  </ul>
                  <p className="mt-2">
                    We do NOT collect real names, addresses, phone numbers, or location data from children.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Do you sell my child's data?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>Never.</strong> We do not sell, rent, or trade any user data. We never have and never will. 
                  Your child's data is used solely to provide the app's services and ensure their safety.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Who can see my child's journal entries?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Your child</strong> - Always has full access to their own entries</li>
                    <li><strong>You (their carer)</strong> - Only entries they choose to share with you</li>
                    <li><strong>Wendy (AI)</strong> - Reviews all entries for safeguarding purposes</li>
                    <li><strong>Our DSL</strong> - Reviews high-priority safeguarding alerts only</li>
                    <li><strong>No one else</strong> - Not teachers, not other children, not third parties</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How do you store data?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  All data is encrypted in transit (HTTPS) and at rest. We use industry-standard cloud infrastructure with:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AES-256 encryption for stored data</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Access controls - only authorized personnel can view data</li>
                    <li>Data backups in secure, geographically distributed locations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I delete my child's data?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes. You can request full account deletion from Settings → Legal & Privacy → Delete My Data. 
                  <br /><br />
                  <strong>What gets deleted:</strong> All journal entries, mood data, profile information, and usage history.
                  <br /><br />
                  <strong>What we keep:</strong> Anonymized safeguarding logs (required for audit trail and legal compliance). 
                  These cannot be linked back to your child.
                  <br /><br />
                  <strong>Grace period:</strong> 30 days - you can cancel deletion within this time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Is this GDPR compliant?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes. We comply fully with GDPR and the UK ICO's Age Appropriate Design Code. This means:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Parental consent required before children can use the app</li>
                    <li>Privacy by design and by default</li>
                    <li>Right to access, correct, and delete data</li>
                    <li>Clear, age-appropriate privacy information</li>
                    <li>Data minimization - we only collect what's necessary</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* AI & Wendy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              AI & Wendy
            </CardTitle>
            <CardDescription>Understanding our AI assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ai-1">
                <AccordionTrigger>Is Wendy a real person?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No. Wendy is an AI (artificial intelligence) assistant. She's not a real person, therapist, or counselor. 
                  Think of her as a very smart chatbot designed to:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Listen to your child's feelings</li>
                    <li>Suggest coping tools and activities</li>
                    <li>Identify when your child might need extra support</li>
                    <li>Provide a safe space to express emotions</li>
                  </ul>
                  <p className="mt-2">
                    Wendy cannot provide therapy, make diagnoses, or respond to emergencies.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ai-2">
                <AccordionTrigger>Can Wendy replace therapy?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>No.</strong> Wendy is a support tool, not a replacement for professional mental health care. 
                  She can:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Complement existing therapy or counseling</li>
                    <li>Help between therapy sessions</li>
                    <li>Provide immediate coping strategies</li>
                  </ul>
                  <p className="mt-2">
                    If your child needs professional help, please contact your GP, school counselor, or a mental health service.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ai-3">
                <AccordionTrigger>How does Wendy detect concerns?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Wendy uses natural language processing to analyze journal entries and chat messages for:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Keywords:</strong> Words like "hurt," "scared," "suicide" trigger alerts</li>
                    <li><strong>Themes:</strong> Repeated mentions of worry, fear, or sadness</li>
                    <li><strong>Patterns:</strong> Changes in mood over time (e.g., sudden decline)</li>
                    <li><strong>Context:</strong> Understanding the situation around concerning language</li>
                  </ul>
                  <p className="mt-2">
                    She's trained to be sensitive and trauma-informed, recognizing that children express distress in many ways.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ai-4">
                <AccordionTrigger>Can Wendy make mistakes?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes. Like any AI, Wendy can misinterpret language or miss subtle cues. That's why:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>A human Designated Safeguarding Lead reviews high-priority alerts</li>
                    <li>We encourage you to monitor your child's wellbeing independently</li>
                    <li>Multiple data points (mood check-ins, journal entries, tool usage) are considered</li>
                  </ul>
                  <p className="mt-2">
                    If you disagree with an alert or feel Wendy missed something, contact our DSL.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ai-5">
                <AccordionTrigger>Does Wendy learn from my child?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Wendy uses your child's entries to provide personalized insights and tool recommendations. However:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>She does NOT train the core AI model on your child's data</li>
                    <li>Your child's entries are NOT shared with other users or used to improve AI for others</li>
                    <li>Personalization stays within your child's account only</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Safeguarding & Escalation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Safeguarding & Escalation
            </CardTitle>
            <CardDescription>How we keep children safe</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="safe-1">
                <AccordionTrigger>When do you escalate to external services?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We escalate to social services, police, or emergency services when:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>A child discloses abuse or neglect</li>
                    <li>There are immediate suicide plans or intent</li>
                    <li>Self-harm is severe or escalating</li>
                    <li>A child is in imminent danger</li>
                  </ul>
                  <p className="mt-2">
                    This is a legal requirement under UK safeguarding law. You will be informed immediately when escalation occurs.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="safe-2">
                <AccordionTrigger>Will you tell me if my child mentions suicide?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>Yes, immediately.</strong> Mentions of suicide or self-harm trigger:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Urgent alert to you via email and in-app notification</li>
                    <li>Crisis support resources shown to your child</li>
                    <li>DSL review within 1 hour</li>
                    <li>Potential escalation to emergency services if risk is imminent</li>
                  </ul>
                  <p className="mt-2">
                    We encourage you to seek immediate professional help (GP, A&E, 999) if you receive this alert.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="safe-3">
                <AccordionTrigger>Do you monitor the app 24/7?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>No.</strong> Automated monitoring happens 24/7, but human DSL review occurs during business hours 
                  (Monday-Friday, 9am-5pm). Outside these hours:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Alerts are still sent to you</li>
                    <li>Your child sees crisis support resources</li>
                    <li>DSL reviews the alert on the next business day</li>
                  </ul>
                  <p className="mt-2 font-semibold">
                    This is NOT an emergency service. For urgent concerns outside business hours, call 999 or Childline (0800 1111).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="safe-4">
                <AccordionTrigger>What if I disagree with an alert?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Contact our DSL at holly@calmconnectiongroup.com to discuss:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Why the alert was triggered</li>
                    <li>Whether escalation is necessary</li>
                    <li>Alternative support options</li>
                  </ul>
                  <p className="mt-2">
                    We take your input seriously, but we have a legal duty of care to escalate genuine safeguarding concerns.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="safe-5">
                <AccordionTrigger>Can I turn off safeguarding monitoring?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong>No.</strong> Safeguarding monitoring is a core feature of the app and cannot be disabled. 
                  This protects:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your child (by ensuring concerns are not missed)</li>
                    <li>Us (legal requirement to monitor for child safety)</li>
                    <li>Other children (duty of care to all users)</li>
                  </ul>
                  <p className="mt-2">
                    If you're uncomfortable with monitoring, this app may not be suitable for your family.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Pseudonyms & Anonymity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Pseudonyms & Anonymity
            </CardTitle>
            <CardDescription>Why we don't use real names</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="pseudo-1">
                <AccordionTrigger>Why can't my child use their real name?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Using nicknames/pseudonyms protects your child if:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>There's a data breach (real identities aren't exposed)</li>
                    <li>Journal entries are accidentally shared</li>
                    <li>Your child's device is accessed by someone else</li>
                  </ul>
                  <p className="mt-2">
                    It also helps children feel more comfortable expressing themselves freely.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pseudo-2">
                <AccordionTrigger>How do you enforce the no-real-names rule?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our system checks nicknames against:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Common first and last names (top 1000)</li>
                    <li>Inappropriate or offensive language</li>
                    <li>Personal identifiers (birthdates, addresses)</li>
                  </ul>
                  <p className="mt-2">
                    If a real name is detected, your child will be prompted to choose a different nickname.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pseudo-3">
                <AccordionTrigger>Can my child change their nickname?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, anytime from Settings → Profile → Change Nickname. We recommend changing it periodically for added privacy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Crisis Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Crisis Support
            </CardTitle>
            <CardDescription>What to do in an emergency</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="crisis-1">
                <AccordionTrigger>My child is in danger right now. What do I do?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <strong className="text-destructive text-base">Call 999 immediately.</strong> Do not wait for the app to respond.
                  <br /><br />
                  If it's not an immediate emergency but you're very concerned:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Call Childline: 0800 1111 (24/7, free, confidential)</li>
                    <li>Text SHOUT to 85258 (crisis text line)</li>
                    <li>Call Samaritans: 116 123 (24/7 emotional support)</li>
                    <li>Contact your GP or local mental health crisis team</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="crisis-2">
                <AccordionTrigger>What if my child refuses to talk to me?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Encourage them to talk to:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Another trusted adult (teacher, school counselor, relative)</li>
                    <li>Childline counselors (0800 1111 - confidential)</li>
                    <li>Their GP (can refer to CAMHS)</li>
                  </ul>
                  <p className="mt-2">
                    Continue monitoring their shared journal entries and mood check-ins for changes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="crisis-3">
                <AccordionTrigger>Where can I get support as a carer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Caring for a child with mental health challenges is hard. Resources for you:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>YoungMinds Parents Helpline:</strong> 0808 802 5544</li>
                    <li><strong>Family Lives:</strong> 0808 800 2222</li>
                    <li><strong>Mind:</strong> Support for your own mental health</li>
                    <li><strong>Local carer support groups:</strong> Ask your GP or search online</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Still Have Questions? */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Still Have Questions?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Contact our Designated Safeguarding Lead:
            </p>
            <a 
              href="mailto:holly@calmconnectiongroup.com"
              className="text-primary hover:underline font-medium flex items-center gap-2"
            >
              holly@calmconnectiongroup.com
            </a>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" asChild>
                <Link to="/carer/privacy-policy">Privacy Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/carer/safeguarding-info">Safeguarding Info</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/carer/pseudonym-policy">Pseudonym Policy</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
