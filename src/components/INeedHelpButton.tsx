import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { HelplineModal } from './HelplineModal';

export function INeedHelpButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-destructive hover:bg-destructive/90 text-white z-50"
        size="icon"
        aria-label="I need help"
      >
        <AlertCircle className="h-6 w-6" />
      </Button>

      <HelplineModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}