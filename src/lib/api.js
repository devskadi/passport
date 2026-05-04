import { supabase, isSupabaseConfigured } from './supabase';

export async function submitAttendance({ fullName, email, branch }) {
/* Lines 2-24 omitted */
}

export async function registerUser(fullName) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('users')
    .upsert({ full_name: fullName }, { onConflict: 'full_name' })
    .select();
  
  if (error) throw error;
  return data;
}

export async function saveMathScore(entry) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Skipping remote save.');
    return null;
  }
  
  // Use the database function to handle the "only if faster" logic
  const { data, error } = await supabase.rpc('save_best_score', {
    p_user_name: entry.userName,
    p_difficulty: entry.difficulty,
    p_score: Math.round(entry.score),
    p_time_seconds: entry.time,
    p_accuracy: entry.accuracy,
    p_wrong_count: entry.wrong
  });

  if (error) throw error;
  return data;
}

export async function getLeaderboard(difficulty) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Returning empty leaderboard.');
    return [];
  }
  const { data, error } = await supabase
    .from('math_workout_scores')
    .select('*')
    .eq('difficulty', difficulty)
    .order('time_seconds', { ascending: true })
    .order('score', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

