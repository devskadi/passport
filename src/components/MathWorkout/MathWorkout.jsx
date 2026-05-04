import React, { useState, useEffect } from 'react';
import WorkoutLobby from './WorkoutLobby';
import WorkoutGame from './WorkoutGame';
import WorkoutResults from './WorkoutResults';

export default function MathWorkout() {
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'countdown' | 'playing' | 'finished'
  const [difficulty, setDifficulty] = useState('normal');
  const [results, setResults] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem('passport_user_name') || 'Explorer');

  useEffect(() => {
    // Sync name if it changes elsewhere
    const handleStorage = () => {
      setUserName(localStorage.getItem('passport_user_name') || 'Explorer');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  const saveScore = (newResult) => {
    const scores = JSON.parse(localStorage.getItem('math_workout_scores') || '[]');
    const entry = {
      ...newResult,
      userName,
      date: new Date().toISOString(),
      id: Date.now()
    };
    scores.push(entry);
    // Sort by shortest time, then highest score
    scores.sort((a, b) => a.time - b.time || b.score - a.score);
    localStorage.setItem('math_workout_scores', JSON.stringify(scores.slice(0, 50))); // Keep top 50
  };

  return (
    <div className="w-full flex-1 flex flex-col">
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
