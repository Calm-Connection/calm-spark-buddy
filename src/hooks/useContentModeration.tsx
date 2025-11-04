import { supabase } from '@/integrations/supabase/client';

interface ModerationResult {
  safe: boolean;
  category: string;
  confidence?: number;
  message?: string;
}

export const useContentModeration = () => {
  const moderateContent = async (
    text: string, 
    context: string = 'avatar_freestyle'
  ): Promise<ModerationResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('moderate-content', {
        body: { text, context }
      });

      if (error) {
        console.error('Moderation error:', error);
        // Safe by default on errors
        return {
          safe: true,
          category: 'safe',
          message: 'Unable to verify content safety'
        };
      }

      return data as ModerationResult;
    } catch (error) {
      console.error('Moderation exception:', error);
      // Safe by default on exceptions
      return {
        safe: true,
        category: 'safe',
        message: 'Unable to verify content safety'
      };
    }
  };

  return { moderateContent };
};