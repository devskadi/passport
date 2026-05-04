import { supabase } from './supabase';

export async function submitAttendance({ fullName, email, branch }) {
/* Lines 2-24 omitted */
}

export async function saveMathScore(entry) {
  const { data, error } = await supabase
    .from('math_workout_scores')
    .upsert(
      { 
        user_name: entry.userName, 
        difficulty: entry.difficulty, 
        score: Math.round(entry.score), 
        time_seconds: entry.time,
        accuracy: entry.accuracy,
        wrong_count: entry.wrong
      }, 
      { onConflict: 'user_name,difficulty' }
    )
    .select();

  if (error) throw error;
  return data;
}

export async function getLeaderboard(difficulty) {
  const { data, error } = await supabase
    .from('math_workout_scores')
    .select('*')
    .eq('difficulty', difficulty)
    .order('score', { ascending: false })
    .order('time_seconds', { ascending: true })
    .limit(10);

  if (error) throw error;
  return data;
}

