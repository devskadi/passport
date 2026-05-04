import React from 'react';
import { Calculator, Trophy, Zap, Flame, Star } from 'lucide-react';

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', desc: 'Basics: + and -', icon: Zap, color: 'var(--turquoise)' },
  { id: 'normal', name: 'Normal', desc: 'All ops: up to 50', icon: Flame, color: 'var(--yellow)' },
  { id: 'hard', name: 'Hard', desc: 'Mastery: up to 100', icon: Star, color: 'var(--pink)' }
];

export default function WorkoutLobby({ onStart, userName }) {
  const scores = JSON.parse(localStorage.getItem('math_workout_scores') || '[]');
  const topScores = scores.slice(0, 5);

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.id}
            onClick={() => onStart(diff.id)}
            className="group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(26,26,46,0.08)',
              boxShadow: '0 4px 12px rgba(26,26,46,0.04)'
            }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12"
              style={{ background: `${diff.color}15`, color: diff.color }}
            >
              <diff.icon size={24} />
            </div>
            <h3 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--ink)' }}>{diff.name}</h3>
            <p className="text-xs" style={{ color: 'var(--ink-mute)' }}>{diff.desc}</p>
            
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ border: `2px solid ${diff.color}` }}
            />
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Trophy size={18} style={{ color: 'var(--yellow-dark)' }} />
          <span className="font-display font-bold text-sm tracking-wider" style={{ color: 'var(--ink-soft)' }}>
            HALL OF FAME
          </span>
        </div>
        
        <div className="stamp-card rounded-xl overflow-hidden divide-y divide-slate-100">
          {topScores.length > 0 ? (
            topScores.map((entry, i) => (
              <div key={entry.id || i} className="flex items-center justify-between p-3 sm:px-4">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-lg w-6" style={{ color: i === 0 ? 'var(--yellow-dark)' : 'var(--ink-mute)' }}>
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm text-left" style={{ color: 'var(--ink)' }}>{entry.userName}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold" style={{ color: 'var(--turquoise-dark)' }}>{Math.round(entry.score)} pts</div>
                  <div className="text-[10px]" style={{ color: 'var(--ink-mute)' }}>{entry.time.toFixed(1)}s</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--ink-mute)' }}>
              No records yet. Be the first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
