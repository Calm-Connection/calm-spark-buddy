import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Heart, Eye, MessageCircle, Shield, Users } from 'lucide-react';

export function SafeguardingPrinciples() {
  const principles = [
    {
      icon: Shield,
      title: 'Empowerment',
      description: 'Help children feel confident about expressing their feelings and concerns',
      details: 'Support your child in developing self-advocacy skills and trust their voice. Create an environment where they feel safe to share without judgment.'
    },
    {
      icon: Heart,
      title: 'Prevention',
      description: 'Proactive support to identify and address concerns early',
      details: 'Regular check-ins and open dialogue can help identify issues before they escalate. Early intervention is key to effective support.'
    },
    {
      icon: MessageCircle,
      title: 'Proportionality',
      description: 'Respond appropriately to the level of risk or concern',
      details: 'Not all concerns require the same response. Match your actions to the severity and immediacy of the situation.'
    },
    {
      icon: Eye,
      title: 'Protection',
      description: 'Ensure safety and wellbeing through appropriate action',
      details: 'When concerns arise, take appropriate steps to ensure your child\'s safety, which may include involving professionals.'
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'Work collaboratively with your child and professionals',
      details: 'Effective safeguarding involves working together with your child, school, healthcare providers, and other support services.'
    },
    {
      icon: BookOpen,
      title: 'Accountability',
      description: 'Take responsibility for safeguarding actions and decisions',
      details: 'Document concerns, actions taken, and outcomes. Be prepared to explain your decisions and learn from experiences.'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle>Safeguarding Principles</CardTitle>
        </div>
        <CardDescription>
          Quick reference guide for supporting your child's wellbeing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <AccordionItem key={index} value={`principle-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{principle.title}</div>
                      <div className="text-sm text-muted-foreground font-normal">
                        {principle.description}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-[52px] text-sm text-foreground/80">
                  {principle.details}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
