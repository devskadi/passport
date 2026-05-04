import React, { useState, useEffect } from 'react';
import WorkoutLobby from './WorkoutLobby';
import WorkoutGame from './WorkoutGame';
import WorkoutResults from './WorkoutResults';
import { Calculator, Loader2 } from 'lucide-react';
import { saveMathScore, registerUser } from '../../lib/api';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function MathWorkout() {
  const [gameState, setGameState] = useState('naming');
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleEnterWorkout = async () => {
    if (userName.trim()) {
      setIsRegistering(true);
      try {
        await registerUser(userName.trim());
        localStorage.setItem('passport_user_name', userName.trim());
        setGameState('lobby');
      } catch (err) {
        console.error('Failed to register user:', err);
        // Fallback to local-only if DB fails
        localStorage.setItem('passport_user_name', userName.trim());
        setGameState('lobby');
      } finally {
        setIsRegistering(false);
      }
    }
  };

  const startWorkout = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('countdown');
  };

  const finishWorkout = (finalResults) => {
    setResults(finalResults);
    setGameState('finished');
    saveScore(finalResults); // Automatically save on finish
  };

  const resetWorkout = () => {
    setGameState('lobby');
    setResults(null);
  };

  const retryWorkout = () => {
    setGameState('countdown');
    setResults(null);
  };

  const saveScore = async (newResult) => {
    try {
      const entry = {
        userName,
        difficulty,
        score: newResult.score,
        time: newResult.time,
        accuracy: newResult.accuracy,
        wrong: newResult.wrong
      };

      // The database RPC now handles the "only if faster" check automatically
      await saveMathScore(entry);
      console.log('Result processed by Database.');

      // Update local storage for the lobby display
      const localScores = JSON.parse(localStorage.getItem('math_workout_scores') || '[]');
      const localIdx = localScores.findIndex(s => s.userName.toLowerCase() === userName.toLowerCase() && s.difficulty === difficulty);
      const localEntry = { ...newResult, userName, date: new Date().toISOString(), id: Date.now() };
      
      if (localIdx !== -1) {
        if (newResult.time < localScores[localIdx].time) localScores[localIdx] = localEntry;
      } else {
        localScores.push(localEntry);
      }
      localStorage.setItem('math_workout_scores', JSON.stringify(localScores));
      
    } catch (err) {
      console.error('Save failed:', err);
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
              disabled={!userName.trim() || isRegistering}
              className="w-full py-4 rounded-2xl font-display font-bold text-lg text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-2"
              style={{ 
                background: 'var(--turquoise)',
                boxShadow: '0 8px 16px -4px rgba(0,210,181,0.3)'
              }}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registering...
                </>
              ) : (
                'Enter Workout'
              )}
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
          onRetry={retryWorkout}
        />
      )}
    </div>
  );
}
