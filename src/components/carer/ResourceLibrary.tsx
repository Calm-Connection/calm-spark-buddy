import { Card, CardSection } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { ExternalLink, BookOpen, Phone, Heart, MessageCircle } from 'lucide-react';

interface Resource {
  title: string;
  description: string;
  link: string;
  tags: string[];
  type: 'article' | 'helpline' | 'guide';
}

interface ResourceLibraryProps {
  activeThemes: string[];
}

export function ResourceLibrary({ activeThemes }: ResourceLibraryProps) {
  // Curated resources mapped to themes
  const allResources: Resource[] = [
    {
      title: 'Supporting Anxious Children',
      description: 'Evidence-based strategies for helping children manage anxiety',
      link: 'https://www.nhs.uk/mental-health/children-and-young-adults/advice-for-parents/',
      tags: ['anxiety', 'worry', 'stress'],
      type: 'guide'
    },
    {
      title: 'Childline - For Parents',
      description: '24/7 support and advice for parents concerned about their child',
      link: 'tel:0808-800-5000',
      tags: ['urgent', 'support', 'crisis'],
      type: 'helpline'
    },
    {
      title: 'Dealing with School Stress',
      description: 'Practical tips for managing academic pressure and school-related worries',
      link: 'https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/school-anxiety-and-refusal/',
      tags: ['school', 'stress', 'pressure'],
      type: 'article'
    },
    {
      title: 'Building Self-Esteem',
      description: 'Ways to nurture confidence and positive self-image in children',
      link: 'https://www.nhs.uk/mental-health/children-and-young-adults/advice-for-parents/help-child-with-low-self-esteem/',
      tags: ['self-esteem', 'confidence', 'worth'],
      type: 'guide'
    },
    {
      title: 'Understanding Self-Harm',
      description: 'A parent\'s guide to recognizing and responding to self-harm',
      link: 'https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/self-harm/',
      tags: ['self-harm', 'urgent', 'crisis'],
      type: 'article'
    },
    {
      title: 'Samaritans - 24/7 Support',
      description: 'Someone to talk to, any time you need it',
      link: 'tel:116-123',
      tags: ['urgent', 'support', 'crisis', 'emotional'],
      type: 'helpline'
    },
    {
      title: 'Helping with Loneliness',
      description: 'Supporting children who feel isolated or lonely',
      link: 'https://www.nhs.uk/every-mind-matters/lifes-challenges/loneliness/',
      tags: ['lonely', 'isolation', 'friends'],
      type: 'guide'
    },
    {
      title: 'Managing Anger in Children',
      description: 'Understanding and helping children process difficult emotions',
      link: 'https://www.nhs.uk/mental-health/children-and-young-adults/advice-for-parents/help-child-with-anger/',
      tags: ['anger', 'frustration', 'emotions'],
      type: 'guide'
    }
  ];

  // Filter resources based on active themes
  const relevantResources = allResources.filter(resource =>
    resource.tags.some(tag => 
      activeThemes.some(theme => 
        theme.toLowerCase().includes(tag) || tag.includes(theme.toLowerCase())
      )
    )
  );

  const displayResources = relevantResources.length > 0 
    ? relevantResources.slice(0, 6)
    : allResources.slice(0, 6);

  const getIcon = (type: Resource['type']) => {
    if (type === 'helpline') return <Phone className="h-4 w-4" />;
    if (type === 'guide') return <BookOpen className="h-4 w-4" />;
    return <MessageCircle className="h-4 w-4" />;
  };

  return (
    <Card className="relative sticky top-6">
      <DecorativeIcon icon="leaf" position="top-right" opacity={0.08} />
      
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        Helpful Resources
      </h3>

      {relevantResources.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Based on current themes:
        </p>
      )}

      <div className="space-y-3">
        {displayResources.map((resource, idx) => (
          <CardSection key={idx} className="group hover:bg-primary/5 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getIcon(resource.type)}
                  <h4 className="font-semibold text-sm">{resource.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {resource.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 2).map((tag, tagIdx) => (
                    <Badge key={tagIdx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardSection>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          💡 These resources are from NHS, YoungMinds, and other trusted UK mental health services.
        </p>
      </div>
    </Card>
  );
}
