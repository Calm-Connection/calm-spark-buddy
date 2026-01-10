import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Clock, Phone, Mail, Heart, Eye, Users, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SafeguardingContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          Safeguarding Information
        </h1>
        <p className="text-muted-foreground mt-1">How we protect your child</p>
      </div>

      {/* Emergency Banner */}
      <Alert className="border-destructive bg-destructive/10">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-destructive font-medium">
          If your child is in immediate danger, call 999 or contact emergency services. 
          This app is not monitored 24/7.
        </AlertDescription>
      </Alert>

      {/* Safeguarding Principles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Our Safeguarding Principles
          </CardTitle>
          <CardDescription>
            These principles guide everything we do
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Child's Wellbeing is Paramount</h3>
              <p className="text-sm text-muted-foreground">
                Every decision prioritizes the safety and best interests of your child.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Early Intervention Prevents Harm</h3>
              <p className="text-sm text-muted-foreground">
                We identify concerns early so appropriate support can be provided quickly.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Transparency Builds Trust</h3>
              <p className="text-sm text-muted-foreground">
                We're clear about how we monitor content and when we'll contact you.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Trauma-Informed & Non-Judgmental</h3>
              <p className="text-sm text-muted-foreground">
                Our AI and processes recognize that children's behaviors reflect their experiences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Age Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Age Requirements & Handling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">👶 Minimum Age</h3>
            <p className="text-sm text-muted-foreground">
              Calm Connection is designed for children aged <strong>7 years and older</strong>. 
              Younger children should not use the app.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">👨‍👩‍👧 Carer Requirements</h3>
            <p className="text-sm text-muted-foreground">
              Carers must be <strong>legal guardians or persons with parental responsibility</strong> 
              for the linked child. This ensures appropriate oversight and consent.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">📅 Date of Birth Handling</h3>
            <p className="text-sm text-muted-foreground">
              Child DOB is used only for age-appropriate content selection. 
              Displayed age is obfuscated (e.g., "10–12 years") to protect privacy. 
              We use age range categories (7-10, 11-13, 14-16) rather than exact ages.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* How We Protect Your Child */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            How We Protect Your Child
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">🤖 AI Content Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Wendy (our AI assistant) reviews all journal entries for concerning language, 
              themes of harm, or distress signals. This happens automatically and immediately.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">🔍 Pattern Detection</h3>
            <p className="text-sm text-muted-foreground">
              Patterns are detected using Wendy's weekly reflection engine, which analyzes 
              mood trends, keyword frequency, missed check-ins, and semantic emotional indicators 
              over time. This helps identify recurring concerns before they escalate.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">👥 Human Oversight</h3>
            <p className="text-sm text-muted-foreground">
              Our Designated Safeguarding Lead (DSL) reviews high-priority alerts and can 
              escalate to appropriate authorities when necessary.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">📧 Prompt Notifications</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive email and in-app alerts when concerning content is detected, 
              so you can support your child promptly.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">🔒 Privacy Protection</h3>
            <p className="text-sm text-muted-foreground">
              We use pseudonyms (nicknames) to protect your child's identity. Real names 
              are never required or stored in journal entries.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Escalation Tier System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Understanding the Escalation System
          </CardTitle>
          <CardDescription>
            We use a 4-tier system to categorize and respond to concerns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Escalation Flow Diagram */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-3">Escalation Flow</h4>
            <div className="flex flex-col items-center space-y-2 text-sm">
              <div className="bg-background px-4 py-2 rounded-lg border">📝 Journal Entry</div>
              <div className="text-muted-foreground">↓</div>
              <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">🤖 Wendy Analysis (AI + Keywords)</div>
              <div className="text-muted-foreground">↓</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                <div className="bg-green-500/10 px-2 py-2 rounded text-center border border-green-500/20">
                  <span className="text-green-600 font-medium">Tier 1</span>
                  <p className="text-xs text-muted-foreground">Supportive</p>
                </div>
                <div className="bg-yellow-500/10 px-2 py-2 rounded text-center border border-yellow-500/20">
                  <span className="text-yellow-600 font-medium">Tier 2</span>
                  <p className="text-xs text-muted-foreground">Tool Tips</p>
                </div>
                <div className="bg-amber-500/10 px-2 py-2 rounded text-center border border-amber-500/20">
                  <span className="text-amber-600 font-medium">Tier 3</span>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                </div>
                <div className="bg-destructive/10 px-2 py-2 rounded text-center border border-destructive/20">
                  <span className="text-destructive font-medium">Tier 4</span>
                  <p className="text-xs text-muted-foreground">Immediate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tier 4 - Red */}
          <div className="border-l-4 border-destructive pl-4 py-2 bg-destructive/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-destructive flex items-center gap-2">
                🔴 Tier 4: Immediate Risk
              </h3>
              <span className="text-xs font-medium text-destructive">Within 1 hour</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Triggers:</strong> Suicidal ideation, self-harm plans, immediate danger, abuse disclosure
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>What happens:</strong>
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>DSL contacted immediately</li>
              <li>You receive urgent email and in-app alert</li>
              <li>Child sees crisis support resources</li>
              <li>DSL may escalate to emergency services or social services</li>
            </ul>
            <div className="mt-3 p-2 bg-destructive/10 rounded text-sm">
              <strong className="text-destructive">⚠️ Quiet Hours Bypass:</strong>
              <span className="text-muted-foreground"> Tier 4 escalations bypass quiet hours and send a push notification plus optional email (if enabled by the carer).</span>
            </div>
          </div>

          {/* Tier 3 - Amber */}
          <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-amber-600 flex items-center gap-2">
                🟠 Tier 3: Significant Concern
              </h3>
              <span className="text-xs font-medium text-amber-600">Within 24 hours</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Triggers:</strong> Persistent worry, mentions of harm without plan, deteriorating mood patterns
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>What happens:</strong>
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>You receive safeguarding alert within 24 hours</li>
              <li>Recommended actions provided (e.g., "Talk to your child's teacher")</li>
              <li>DSL reviews for escalation decision</li>
              <li>Wendy suggests coping tools to your child</li>
            </ul>
          </div>

          {/* Tier 2 - Yellow */}
          <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-500/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-yellow-600 flex items-center gap-2">
                🟡 Tier 2: Moderate Concern
              </h3>
              <span className="text-xs font-medium text-yellow-600">Within 48 hours</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Triggers:</strong> Occasional worry themes, low mood, stress indicators
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>What happens:</strong>
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>You receive insight summary within 48 hours</li>
              <li>Suggested conversation starters provided</li>
              <li>Monitoring continues for patterns</li>
              <li>No DSL escalation unless pattern emerges</li>
            </ul>
          </div>

          {/* Tier 1 - Green */}
          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-500/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-green-600 flex items-center gap-2">
                🟢 Tier 1: General Support
              </h3>
              <span className="text-xs font-medium text-green-600">No urgent action</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Triggers:</strong> Normal developmental concerns, positive entries, general journaling
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>What happens:</strong>
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>No alerts sent</li>
              <li>Wendy provides encouraging responses</li>
              <li>Insights available in your dashboard</li>
              <li>Tools and resources suggested as appropriate</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Journal Access & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Carer Access to Journal Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your child's privacy is important. Carers see entries <strong>only</strong> when:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
            <li>The child <strong>chooses to share</strong> an entry with you</li>
            <li>An entry is escalated at <strong>Tier 3</strong> (significant concern) or <strong>Tier 4</strong> (immediate risk)</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>All other entries remain private.</strong> This helps children feel safe expressing 
            themselves honestly while ensuring genuine concerns are flagged.
          </p>
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> High-risk messages are stored securely in safeguarding logs 
              and visible to carers only when escalation tier ≥3. Normal conversations stay private.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* UI Safety Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Safety Features in the App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">🆘 "I Need Help" Button</h3>
            <p className="text-sm text-muted-foreground">
              Available to <strong>children only</strong>. Shows crisis support resources 
              (Childline, emergency numbers) immediately.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">🐛 Report Concern (Bug/Issue)</h3>
            <p className="text-sm text-muted-foreground">
              Available to <strong>both children and carers</strong>. Used for reporting 
              technical issues, bugs, or app problems. This is NOT for safeguarding concerns.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">💬 WendyChat</h3>
            <p className="text-sm text-muted-foreground">
              If a child shares something concerning, Wendy responds with crisis scripts 
              and logs it securely. <strong>Child reports go only to safeguarding logs, 
              not to other users.</strong>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">📞 Helpline Modal</h3>
            <p className="text-sm text-muted-foreground">
              Quick access to UK helplines (Childline, Samaritans, emergency services) 
              for both children and carers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Your Role as a Carer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Your Role as a Carer
          </CardTitle>
          <CardDescription>
            We work together to keep your child safe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <span className="text-primary">✓</span>
            <p className="text-sm text-muted-foreground">
              <strong>Monitor shared entries:</strong> Review journal entries your child chooses to share
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">✓</span>
            <p className="text-sm text-muted-foreground">
              <strong>Respond to alerts promptly:</strong> Act on safeguarding alerts within 24 hours
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">✓</span>
            <p className="text-sm text-muted-foreground">
              <strong>Maintain open communication:</strong> Use conversation starters from insights
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">✓</span>
            <p className="text-sm text-muted-foreground">
              <strong>Trust your instincts:</strong> If something feels wrong, contact our DSL or your child's school
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">✓</span>
            <p className="text-sm text-muted-foreground">
              <strong>Report concerns:</strong> Use the "Report Concern" button for technical issues, or contact the DSL for safeguarding matters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact DSL */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Contact Our Designated Safeguarding Lead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            If you have concerns about your child's safety or questions about a safeguarding alert:
          </p>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a 
                href="mailto:holly@calmconnectiongroup.com"
                className="text-primary hover:underline font-medium"
              >
                holly@calmconnectiongroup.com
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Response time: Within 4 hours during business hours (Mon-Fri, 9am-5pm)
            </p>
          </div>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-xs">
              For out-of-hours emergencies, contact 999, Childline (0800 1111), or your local social services.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
