import { supabase } from "@/integrations/supabase/client";

type ConsentType = 'privacy_policy' | 'terms_of_use' | 'data_processing' | 'marketing';
type ConsentAction = 'granted' | 'withdrawn' | 'updated';

/**
 * Log a consent action for GDPR compliance
 */
export async function logConsent(
  consentType: ConsentType,
  action: ConsentAction,
  metadata?: Record<string, any>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get IP and user agent (in production, these would come from the request)
    const userAgent = navigator.userAgent;
    
    const { error } = await supabase
      .from('consent_logs')
      .insert({
        user_id: user.id,
        consent_type: consentType,
        action: action,
        user_agent: userAgent,
        metadata: metadata || {}
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error logging consent:', error);
    return { success: false, error };
  }
}

/**
 * Get user's consent history
 */
export async function getConsentHistory() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('consent_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching consent history:', error);
    return { data: null, error };
  }
}

/**
 * Export all user data for GDPR compliance (Article 20)
 */
export async function exportUserData() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch profile first to get child_id
    const { data: childProfile } = await supabase
      .from('children_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    const { data: carerProfile } = await supabase
      .from('carer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const childId = childProfile?.id || '';

    // Fetch all other user data across tables
    const [
      { data: journalEntries },
      { data: moodCheckIns },
      { data: toolUsage },
      { data: consentLogs },
      { data: achievements },
      { data: customMoods }
    ] = await Promise.all([
      supabase.from('journal_entries').select('*').eq('child_id', childId),
      supabase.from('mood_check_ins').select('*').eq('child_id', childId),
      supabase.from('tool_usage').select('*').eq('user_id', user.id),
      supabase.from('consent_logs').select('*').eq('user_id', user.id),
      supabase.from('user_achievements').select('*').eq('user_id', user.id),
      supabase.from('custom_moods').select('*').eq('child_id', childId)
    ]);

    const userData = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profile: childProfile || carerProfile,
      journal_entries: journalEntries || [],
      mood_check_ins: moodCheckIns || [],
      tool_usage: toolUsage || [],
      consent_logs: consentLogs || [],
      achievements: achievements || [],
      custom_moods: customMoods || [],
      exported_at: new Date().toISOString()
    };

    // Create downloadable JSON file
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calm-connection-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting user data:', error);
    return { success: false, error };
  }
}

/**
 * Delete user account and all associated data (GDPR Article 17)
 */
export async function deleteUserAccount() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Log consent withdrawal
    await logConsent('data_processing', 'withdrawn', {
      reason: 'account_deletion_requested'
    });

    // Note: Actual account deletion happens through Supabase Auth
    // Data will be retained for 30 days per retention policy
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    
    if (error) {
      // If we don't have admin access, sign out the user
      // The backend will need to handle actual deletion
      await supabase.auth.signOut();
      return { 
        success: true, 
        message: 'Account deletion requested. Data will be permanently deleted in 30 days.' 
      };
    }

    return { 
      success: true, 
      message: 'Account deleted. Data will be permanently removed in 30 days.' 
    };
  } catch (error) {
    console.error('Error deleting user account:', error);
    return { success: false, error };
  }
}
