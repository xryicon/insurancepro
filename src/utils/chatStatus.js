import { supabase } from '../lib/supabase';
import { isWithinBusinessHours } from './chatHours';

export async function getChatStatus() {
  const { data } = await supabase
    .from('chat_settings')
    .select('*')
    .single();

  if (!data) return isWithinBusinessHours();

  // Admin overrides ALWAYS win
  if (data.force_offline) return false;
  if (data.force_online) return true;

  return isWithinBusinessHours();
}