import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrivacyPolicyContent } from '@/components/policy/PrivacyPolicyContent';
import { TermsOfUseContent } from '@/components/policy/TermsOfUseContent';
import { SafeguardingContent } from '@/components/policy/SafeguardingContent';

export type PolicyType = 'privacy' | 'terms' | 'safeguarding';

interface PolicySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policyType: PolicyType;
}

const policyTitles: Record<PolicyType, string> = {
  'privacy': 'Privacy Policy',
  'terms': 'Terms of Use',
  'safeguarding': 'Safeguarding Information',
};

export function PolicySheet({ open, onOpenChange, policyType }: PolicySheetProps) {
  const renderContent = () => {
    switch (policyType) {
      case 'privacy':
        return <PrivacyPolicyContent />;
      case 'terms':
        return <TermsOfUseContent />;
      case 'safeguarding':
        return <SafeguardingContent />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b bg-background sticky top-0 z-10">
          <SheetTitle>{policyTitles[policyType]}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6 py-4">
          {renderContent()}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
