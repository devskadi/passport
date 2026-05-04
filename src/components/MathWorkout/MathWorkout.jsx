import React, { useState, useEffect } from 'react';
import WorkoutLobby from './WorkoutLobby';
import WorkoutGame from './WorkoutGame';
import WorkoutResults from './WorkoutResults';
import { Calculator } from 'lucide-react';
import { saveMathScore } from '../../lib/api';

export default function MathWorkout() {
  const [gameState, setGameState] = useState(() => {
    try {
      return localStorage.getItem('passport_user_name') ? 'lobby' : 'naming';
    } catch (e) {
      return 'naming';
    }
  }); 
  const [difficulty, setDifficulty] = useState('normal');
  const [results, setResults] = useState(null);
  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('passport_user_name') || '';
    } catch (e) {
      return '';
    }
  });

  useEffect(() => {
    // Sync name if it changes elsewhere
    const handleStorage = () => {
      const storedName = localStorage.getItem('passport_user_name');
      if (storedName) {
        setUserName(storedName);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleEnterWorkout = () => {
    if (userName.trim()) {
      localStorage.setItem('passport_user_name', userName.trim());
      setGameState('lobby');
    }
  };

  const startWorkout = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('countdown');
  };

  const finishWorkout = (finalResults) => {
    setResults(finalResults);
    setGameState('finished');
  };

  const resetWorkout = () => {
    setGameState('lobby');
    setResults(null);
  };

  const saveScore = async (newResult) => {
    const scores = JSON.parse(localStorage.getItem('math_workout_scores') || '[]');
    
    // Check if user already has a score for this difficulty
    const existingIndex = scores.findIndex(s => s.userName === userName && s.difficulty === difficulty);
    
    const entry = {
      ...newResult,
      userName,
      date: new Date().toISOString(),
      id: Date.now()
    };

    if (existingIndex !== -1) {
      // If new score is higher (or same score but faster time), overwrite
      const prev = scores[existingIndex];
      if (newResult.score > prev.score || (newResult.score === prev.score && newResult.time < prev.time)) {
        scores[existingIndex] = entry;
      }
    } else {
      scores.push(entry);
    }

    // Sort globally still for Hall of Fame if needed, but we'll filter in the lobby
    scores.sort((a, b) => b.score - a.score || a.time - b.time);
    localStorage.setItem('math_workout_scores', JSON.stringify(scores.slice(0, 100))); // Keep top 100

    // Save to Supabase
    try {
      await saveMathScore(entry);
      console.log('Score synced to Supabase');
    } catch (err) {
      console.error('Database sync failed:', err);
    }
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col">
      {gameState === 'naming' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            Math Workout
          </h2>
          <p className="font-hand text-xl mb-8" style={{ color: 'var(--ink-soft)' }}>
            Tell us your name to start the drill
          </p>

          <div className="w-full max-w-sm flex flex-col gap-4">
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name here"
              className="w-full px-6 py-4 rounded-2xl text-center text-lg font-bold border-2 transition-all focus:outline-none"
              style={{ 
                borderColor: 'rgba(26,26,46,0.1)',
                color: 'var(--ink)',
                background: '#FFFFFF'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleEnterWorkout()}
            />
            <button
              onClick={handleEnterWorkout}
              disabled={!userName.trim()}
              className="w-full py-4 rounded-2xl font-display font-bold text-lg text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
              style={{ 
                background: 'var(--turquoise)',
                boxShadow: '0 8px 16px -4px rgba(0,210,181,0.3)'
              }}
            >
              Enter Workout
            </button>
          </div>
        </div>
      )}

      {gameState === 'lobby' && (
        <WorkoutLobby onStart={startWorkout} userName={userName} />
      )}
      
      {(gameState === 'countdown' || gameState === 'playing') && (
        <WorkoutGame 
          difficulty={difficulty} 
          onFinish={finishWorkout} 
          onBack={resetWorkout}
          isCountdown={gameState === 'countdown'}
          onCountdownEnd={() => setGameState('playing')}
        />
      )}

      {gameState === 'finished' && (
        <WorkoutResults 
          results={results} 
          onReset={resetWorkout} 
          onSave={saveScore}
        />
      )}
    </div>
  );
}
