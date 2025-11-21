import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { UserX, Shield, AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PseudonymPolicy() {
  const navigate = useNavigate();

  const acceptableExamples = [
    'SunnyDay123',
    'RainbowDreamer',
    'HappyPanda',
    'StarGazer',
    'MusicLover99',
    'BookwormBee',
  ];

  const unacceptableExamples = [
    { name: 'JohnSmith2010', reason: 'Contains real name' },
    { name: 'London_SE1', reason: 'Contains location' },
    { name: '07700900123', reason: 'Contains phone number' },
    { name: 'Oak_Primary', reason: 'Identifies school' },
    { name: 'SarahJones', reason: 'Contains real name' },
    { name: '15_Baker_Street', reason: 'Contains address' },
  ];

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
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserX className="h-6 w-6 text-primary" />
              Pseudonym & No Real Names Policy
            </CardTitle>
            <CardDescription>
              Why we use nicknames and how to choose a safe one
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2 mt-0">
                <Shield className="h-5 w-5 text-primary" />
                Core Principle: Privacy First
              </h3>
              <p className="text-muted-foreground mb-0">
                <strong>Real names, addresses, phone numbers, school names, and photos are strictly prohibited.</strong> This policy protects children's identities and ensures their online safety.
              </p>
            </div>

            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="text-base">Why We Use Pseudonyms (Nicknames)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>🛡️ Safety:</strong>
                  <p className="text-muted-foreground mt-1">
                    Pseudonyms prevent children from being identified by strangers. Even if data is compromised, real identities remain protected.
                  </p>
                </div>
                <div>
                  <strong>🔒 Anonymity:</strong>
                  <p className="text-muted-foreground mt-1">
                    Children can express their feelings freely without fear of being personally identified. This encourages honest journaling.
                  </p>
                </div>
                <div>
                  <strong>⚖️ Legal Compliance:</strong>
                  <p className="text-muted-foreground mt-1">
                    GDPR and the ICO Children's Code require us to minimize personal data collection. Pseudonyms are the safest way to provide personalized support.
                  </p>
                </div>
                <div>
                  <strong>💜 Empowerment:</strong>
                  <p className="text-muted-foreground mt-1">
                    Choosing a fun nickname lets children create their own identity in our safe space. It's a way to express themselves creatively.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Good Nickname Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {acceptableExamples.map((example) => (
                    <div
                      key={example}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg text-center"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-semibold">{example}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  ✅ These nicknames are fun, creative, and don't reveal personal information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Unacceptable Nickname Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unacceptableExamples.map((example) => (
                    <div
                      key={example.name}
                      className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <span className="text-sm font-semibold line-through">{example.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{example.reason}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-destructive mt-4">
                  ⚠️ These nicknames reveal personal information and will be blocked by our system.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">How to Choose a Safe Nickname</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong className="text-foreground">Do Choose:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Fun words that describe you (HappyArtist, QuietReader)</li>
                    <li>Favorite things (CookieMonster, StarWatcher)</li>
                    <li>Random combinations (BlueWolf, SunnyCloud)</li>
                    <li>Add numbers for uniqueness (Rainbow123, DreamBig99)</li>
                    <li>Animals, colors, nature, hobbies (PandaFan, GreenThumb)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Don't Include:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-destructive">
                    <li>Your real first or last name</li>
                    <li>Your birthdate (DD/MM/YYYY or age)</li>
                    <li>Your address, street name, or postcode</li>
                    <li>Your school name or class</li>
                    <li>Your town or city</li>
                    <li>Phone numbers or email addresses</li>
                  </ul>
                </div>
                <div className="bg-accent/20 p-3 rounded-lg">
                  <strong className="text-foreground">💡 Tip for Parents:</strong>
                  <p className="text-muted-foreground mt-1">
                    Help your child choose a nickname together. Make it a fun activity! Think about their favorite animals, colors, or hobbies.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="text-base">Technical Enforcement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Our system automatically checks nicknames to ensure compliance with this policy:
                </p>
                <div>
                  <strong className="text-foreground">Real-Time Validation:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Checks against database of common first/last names (UK & international)</li>
                    <li>Flags location identifiers (postcodes, city names, landmarks)</li>
                    <li>Detects phone numbers and numeric patterns resembling dates</li>
                    <li>Blocks school names and educational institutions</li>
                    <li>Filters inappropriate or offensive language</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">If a Nickname is Rejected:</strong>
                  <p className="text-muted-foreground mt-1">
                    You'll see a clear message explaining why and suggestions for alternatives. This happens instantly as you type.
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <strong className="text-foreground">Character Limits:</strong>
                  <p className="text-muted-foreground mt-1">
                    Nicknames must be 3-20 characters long. No special characters except numbers, hyphens, and underscores.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base">Changing Your Nickname</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">You can change your nickname anytime in Settings.</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>No limit on how many times you can change it</li>
                  <li>Previous nicknames are not stored or visible</li>
                  <li>We recommend changing it every few months for extra privacy</li>
                  <li>Your carer will see the new nickname after you change it</li>
                </ul>
                <div className="bg-secondary/10 p-3 rounded-lg mt-3">
                  <strong className="text-foreground">Why Change Regularly?</strong>
                  <p className="mt-1">
                    Changing your nickname periodically adds an extra layer of privacy, especially if you use other online services with similar usernames.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  What Happens If Real Information Is Detected?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong className="text-foreground">During Signup:</strong>
                  <p className="text-muted-foreground mt-1">
                    The system will block the nickname and ask you to choose a different one. You won't be able to proceed until you select a compliant nickname.
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">In Journal Entries:</strong>
                  <p className="text-muted-foreground mt-1">
                    If our AI (Wendy) detects real names, addresses, or personal identifiers in journal entries, we may:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Send a gentle reminder about keeping information private</li>
                    <li>Redact sensitive information from shared entries</li>
                    <li>Contact your carer if it appears unintentional disclosure</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                  <strong className="text-foreground">We Never Punish Mistakes:</strong>
                  <p className="text-muted-foreground mt-1">
                    If you accidentally mention a real name or location, we understand! We'll help you correct it, not punish you. This policy exists to protect you, not restrict you.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="text-base">For Parents & Carers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">Your Responsibilities:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Help your child choose an appropriate nickname during signup</li>
                    <li>Explain why we don't use real names (safety, privacy)</li>
                    <li>Remind them not to share personal details in journal entries</li>
                    <li>Lead by example - use a nickname yourself</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Safeguarding Context:</strong>
                  <p className="mt-1">
                    This policy aligns with UK safeguarding guidelines and GDPR's data minimization principle. By using pseudonyms, we reduce the risk of:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Identity theft or doxxing</li>
                    <li>Unwanted contact from strangers</li>
                    <li>Exposure in the event of a data breach</li>
                    <li>Social engineering attacks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base">Reporting Violations</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground mb-3">
                  If you notice a user with a nickname that violates this policy (contains real names, locations, etc.), please report it:
                </p>
                <div className="bg-primary/10 p-4 rounded-lg space-y-1">
                  <p><strong>Designated Safeguarding Lead:</strong> Holly</p>
                  <p><strong>Email:</strong> holly@calmconnectiongroup.com</p>
                  <p><strong>In-app:</strong> Settings → Report a Concern</p>
                </div>
                <p className="text-muted-foreground mt-3">
                  We take violations seriously and will investigate all reports within 24 hours.
                </p>
              </CardContent>
            </Card>

            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="font-semibold text-foreground">
                Remember: Nicknames are fun AND keep you safe! 🛡️💜
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                If you ever need help choosing a nickname, ask your carer or contact us.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/20 border-accent">
          <CardHeader>
            <CardTitle className="text-base">Related Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/carer/privacy-policy')}>
              → Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/carer/terms-of-use')}>
              → Terms of Use
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/carer/safeguarding-info')}>
              → Safeguarding Information
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/carer/trust-safety-faq')}>
              → Trust & Safety FAQs
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
