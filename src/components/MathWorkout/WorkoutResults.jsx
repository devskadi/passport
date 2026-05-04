import React from 'react';
import { Trophy, Clock, Target, RotateCcw, Share2, Save } from 'lucide-react';

export default function WorkoutResults({ results, onReset, onSave }) {
  const [saved, setSaved] = React.useState(false);
  const { score, time, accuracy, difficulty, questions, wrong } = results;

  const handleSave = () => {
    if (saved) return;
    onSave(results);
    setSaved(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
      <div className="mb-8">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative"
          style={{ 
            background: 'linear-gradient(135deg, var(--yellow) 0%, var(--yellow-dark) 100%)',
            boxShadow: '0 12px 32px -8px rgba(255,201,60,0.5)'
          }}
        >
          <Trophy size={48} color="#FFFFFF" />
          <div className="absolute -inset-2 rounded-full border-2 border-yellow animate-pulse" />
        </div>
        
        <h2 className="font-display font-black text-4xl sm:text-5xl mb-2" style={{ color: 'var(--ink)' }}>
          Workout Complete!
        </h2>
        <div className="font-hand text-2xl" style={{ color: 'var(--turquoise-dark)' }}>
          brilliant effort on {difficulty} mode
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
        <div className="stamp-card rounded-2xl p-6">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-60">
            <Trophy size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">Total Score</span>
          </div>
          <div className="font-display font-black text-4xl" style={{ color: 'var(--ink)' }}>
            {score.toLocaleString()}
          </div>
        </div>

        <div className="stamp-card rounded-2xl p-6">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-60">
            <Clock size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">Final Time</span>
          </div>
          <div className="font-display font-black text-4xl" style={{ color: 'var(--ink)' }}>
            {time.toFixed(1)}s
          </div>
        </div>

        <div className="stamp-card rounded-2xl p-6">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-60">
            <Target size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">Accuracy</span>
          </div>
          <div className="font-display font-black text-4xl" style={{ color: 'var(--ink)' }}>
            {Math.round(accuracy)}%
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-display font-bold text-lg bg-white border-2 border-slate-100 hover:border-turquoise hover:text-turquoise transition-all active:scale-95"
          style={{ color: 'var(--ink-soft)' }}
        >
          <RotateCcw size={20} />
          Play Again
        </button>
        
        <button
          onClick={handleSave}
          disabled={saved}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-display font-bold text-lg text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            background: saved ? 'var(--turquoise-dark)' : 'var(--turquoise)',
            boxShadow: saved ? 'none' : '0 8px 20px -6px rgba(13,181,166,0.6)'
          }}
        >
          {saved ? <Share2 size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Result'}
        </button>
      </div>

      <div className="mt-12 text-sm max-w-xs mx-auto" style={{ color: 'var(--ink-mute)' }}>
        <p>You answered {questions} questions with {wrong} errors.</p>
        <p className="mt-1">Keep it up to reach the top of the leaderboard!</p>
      </div>
    </div>
  );
}
