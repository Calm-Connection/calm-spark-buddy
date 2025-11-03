import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageLayout } from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ASSET_GENERATION_PROMPTS } from '@/constants/avatarAssets';
import { Loader2 } from 'lucide-react';

export default function GenerateAvatarAssets() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAsset, setCurrentAsset] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const generateAllAssets = async () => {
    setGenerating(true);
    setProgress(0);
    setLogs([]);
    addLog('Starting asset generation...');

    const assetTypes = Object.keys(ASSET_GENERATION_PROMPTS);
    let totalAssets = 0;
    let completedAssets = 0;

    // Count total assets
    for (const assetType of assetTypes) {
      totalAssets += Object.keys(ASSET_GENERATION_PROMPTS[assetType as keyof typeof ASSET_GENERATION_PROMPTS]).length;
    }

    addLog(`Total assets to generate: ${totalAssets}`);

    try {
      for (const assetType of assetTypes) {
        const prompts = ASSET_GENERATION_PROMPTS[assetType as keyof typeof ASSET_GENERATION_PROMPTS];
        
        for (const [assetKey, prompt] of Object.entries(prompts)) {
          setCurrentAsset(`${assetType}/${assetKey}`);
          addLog(`Generating ${assetType}/${assetKey}...`);

          try {
            const { data, error } = await supabase.functions.invoke('generate-avatar-assets', {
              body: { assetType, assetKey, prompt }
            });

            if (error) throw error;

            if (data?.success) {
              addLog(`✓ Generated ${assetType}/${assetKey}`);
            } else {
              addLog(`✗ Failed ${assetType}/${assetKey}: ${data?.error || 'Unknown error'}`);
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            addLog(`✗ Error ${assetType}/${assetKey}: ${errorMessage}`);
            
            // If rate limited, wait before continuing
            if (errorMessage.includes('429')) {
              addLog('Rate limited - waiting 30 seconds...');
              await new Promise(resolve => setTimeout(resolve, 30000));
            }
          }

          completedAssets++;
          setProgress((completedAssets / totalAssets) * 100);

          // Small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      addLog('Asset generation complete!');
      toast.success('All avatar assets generated successfully!');
    } catch (error) {
      console.error('Asset generation failed:', error);
      addLog(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Asset generation failed. Check logs for details.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Generate Avatar Assets</h1>
          <p className="text-muted-foreground mb-6">
            This will generate all pre-made Disney/Pixar style avatar assets and upload them to Supabase Storage.
            This process takes approximately 30 minutes and should only be run once during initial setup.
          </p>

          {!generating && progress === 0 && (
            <Button onClick={generateAllAssets} size="lg" className="w-full">
              Start Asset Generation
            </Button>
          )}

          {generating && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating: {currentAsset}</span>
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Generation Log</h2>
              <div className="bg-muted/50 rounded-lg p-4 h-[400px] overflow-y-auto font-mono text-xs space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={log.includes('✗') ? 'text-destructive' : log.includes('✓') ? 'text-green-600' : ''}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
