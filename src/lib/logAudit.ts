import { supabase } from "./supabaseClient";

export async function logAudit(action: string, targetType: string, targetId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const userEmail = user?.email || 'System/Anonymous';
    
    const { error } = await supabase.from('audit_logs').insert({
      action: `[${userEmail}] ${action} (${targetType}: ${targetId})`
    });
    
    if (error) {
    }
  } catch (err) {
  }
}
