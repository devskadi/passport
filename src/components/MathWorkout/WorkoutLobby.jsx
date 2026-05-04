import React, { useState, useEffect } from 'react';
import { Calculator, Trophy, Zap, Flame, Star, Loader2 } from 'lucide-react';
import { getLeaderboard } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', desc: 'Basics: + and -', icon: Zap, color: 'var(--turquoise)' },
  { id: 'normal', name: 'Normal', desc: 'All ops: up to 50', icon: Flame, color: 'var(--yellow)' },
  { id: 'hard', name: 'Hard', desc: 'Mastery: up to 100', icon: Star, color: 'var(--pink)' }
];

export default function WorkoutLobby({ onStart, userName }) {
  const [selectedDiff, setSelectedDiff] = useState('normal');
  const [dbScores, setDbScores] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter scores by the selected difficulty from Supabase
  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      try {
        let data = [];
        if (isSupabaseConfigured) {
          data = await getLeaderboard(selectedDiff);
        }
        setDbScores(data || []);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, [selectedDiff]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ 
          background: 'var(--pink)', 
          color: '#FFFFFF', 
          boxShadow: '0 12px 24px -6px rgba(255,61,127,0.4)',
          transform: 'rotate(-5deg)'
        }}
      >
        <Calculator size={40} strokeWidth={1.5} />
      </div>

      <h2 className="font-display font-black text-3xl sm:text-4xl mb-2" style={{ color: 'var(--ink)' }}>
        Ready for a drill?
      </h2>
      <p className="font-hand text-xl mb-10" style={{ color: 'var(--ink-soft)' }}>
        pick your level and sharpen your mind
      </p>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mb-8 px-2">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.id}
            onClick={() => setSelectedDiff(diff.id)}
            className="group relative flex flex-col items-center p-3 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(26,26,46,0.08)',
              boxShadow: '0 4px 12px rgba(26,26,46,0.04)',
              borderColor: selectedDiff === diff.id ? diff.color : 'rgba(26,26,46,0.08)',
              borderWidth: '2px'
            }}
          >
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform group-hover:rotate-12"
              style={{ background: `${diff.color}15`, color: diff.color }}
            >
              <diff.icon size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-display font-bold text-sm sm:text-lg mb-0.5 sm:mb-1" style={{ color: 'var(--ink)' }}>{diff.name}</h3>
            <p className="text-[10px] sm:text-xs leading-tight" style={{ color: 'var(--ink-mute)' }}>{diff.desc}</p>
          </button>
        ))}
      </div>

      <div className="w-full max-w-md mb-8">
        <button
          onClick={() => onStart(selectedDiff)}
          className="w-full py-4 rounded-2xl font-display font-bold text-lg text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ 
            background: 'var(--turquoise)',
            boxShadow: '0 8px 16px -4px rgba(0,210,181,0.3)'
          }}
        >
          Enter Workout ({selectedDiff.toUpperCase()})
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Trophy size={18} style={{ color: 'var(--yellow-dark)' }} />
          <span className="font-display font-bold text-sm tracking-wider" style={{ color: 'var(--ink-soft)' }}>
            Rankings: {selectedDiff.toUpperCase()}
          </span>
        </div>
        
        <div className="stamp-card rounded-xl overflow-hidden divide-y divide-slate-100 min-h-[120px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-8 text-turquoise">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : dbScores.length > 0 ? (
            dbScores.map((entry, i) => {
              const isTop3 = i < 3;
              const rankColors = [
                'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)', // Gold
                'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)', // Silver
                'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'  // Bronze
              ];

              return (
                <div 
                  key={entry.id || i} 
                  className={`flex items-center justify-between p-4 transition-all ${isTop3 ? 'my-1 rounded-xl mx-2 shadow-sm' : ''}`}
                  style={{ 
                    background: isTop3 ? `${rankColors[i]}15` : 'transparent',
                    borderLeft: isTop3 ? `4px solid ${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32'}` : 'none'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm ${isTop3 ? 'text-white' : 'text-ink-mute'}`}
                      style={{ 
                        background: isTop3 ? rankColors[i] : 'transparent',
                        boxShadow: isTop3 ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`font-bold ${isTop3 ? 'text-sm sm:text-base' : 'text-sm'}`} style={{ color: 'var(--ink)' }}>
                        {entry.user_name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-sans text-sm font-black" style={{ color: 'var(--turquoise-dark)' }}>
                      {entry.time_seconds.toFixed(2)}s
                    </div>
                    <div className="text-[10px] font-bold opacity-60" style={{ color: 'var(--ink-mute)' }}>
                      {entry.score} / 20
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--ink-mute)' }}>
              No records for {selectedDiff} yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
