import React, { useState, useEffect, useRef } from 'react';
import { Timer, AlertTriangle, ChevronRight, Hash, ArrowLeft } from 'lucide-react';
import { generateQuestions } from './utils';

export default function WorkoutGame({ difficulty, onFinish, onBack, isCountdown, onCountdownEnd }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const timerRef = useRef(null);

  // Initialize questions
  useEffect(() => {
    setQuestions(generateQuestions(difficulty));
  }, [difficulty]);

  // Handle Countdown
  useEffect(() => {
    if (isCountdown) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        onCountdownEnd();
        setStartTime(Date.now());
      }
    }
  }, [isCountdown, countdown, onCountdownEnd]);

  // Timer logic
  useEffect(() => {
    if (!isCountdown && startTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 10);
      return () => clearInterval(timerRef.current);
    }
  }, [isCountdown, startTime]);

  const currentQuestion = questions[currentIndex];

  const handleKeyPress = (num) => {
    if (isCountdown) return;
    
    const newVal = input + num;
    setInput(newVal);

    // Auto-submit logic
    const expected = String(currentQuestion.answer);
    if (newVal.length >= expected.length) {
      if (newVal === expected) {
        // Correct
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setInput('');
          } else {
            // Finished
            const totalDuration = (Date.now() - startTime) / 1000;
            onFinish({
              score: calculateScore(questions.length, totalDuration, wrongCount),
              time: totalDuration,
              accuracy: (questions.length / (questions.length + wrongCount)) * 100,
              difficulty,
              questions: questions.length,
              wrong: wrongCount
            });
          }
        }, 200);
      } else {
        // Wrong
        setWrongCount(prev => prev + 1);
        setStartTime(prev => prev - 5000); // Add 5 seconds to timer immediately
        setShowPenalty(true);
        setTimeout(() => setShowPenalty(false), 1000);
        setInput(''); // Clear on wrong
      }
    }
  };

  const calculateScore = (count, time, wrong) => {
    // Base score based on count and difficulty
    const multipliers = { easy: 100, normal: 200, hard: 400 };
    const base = count * (multipliers[difficulty] || 200);
    // Time bonus (faster = more)
    const timeBonus = Math.max(0, 5000 - (time * 20));
    // Accuracy penalty
    const accuracyBonus = Math.max(0, 1000 - (wrong * 150));
    return Math.floor(base + timeBonus + accuracyBonus);
  };

  const formatTime = (ms) => {
    const totalSeconds = ms / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  const currentScore = calculateScore(currentIndex, elapsed / 1000, wrongCount);

  if (isCountdown) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-turquoise-soft opacity-20" />
          <div 
            className="w-32 h-32 rounded-full flex items-center justify-center font-display font-black text-6xl"
            style={{ 
              background: 'var(--turquoise)', 
              color: '#FFFFFF',
              boxShadow: '0 0 40px rgba(13,181,166,0.3)'
            }}
          >
            {countdown}
          </div>
        </div>
        <p className="mt-8 font-display font-bold text-lg tracking-widest" style={{ color: 'var(--ink-mute)' }}>
          GET READY...
        </p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 animate-in fade-in duration-500">
      {/* HUD */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors"
            style={{ color: 'var(--ink)' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-ink-mute uppercase">Timer</span>
            <div className="flex items-center gap-2 font-sans font-bold text-xl" style={{ color: 'var(--ink)' }}>
              <Timer size={18} className="text-turquoise" />
              {formatTime(elapsed)}
              {showPenalty && (
                <span className={`text-sm font-bold text-pink ml-1 animate-bounce`}>
                  +5s
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold tracking-widest text-ink-mute uppercase">Score</span>
          <div className="font-sans font-black text-xl" style={{ color: 'var(--ink)' }}>
            {currentIndex + 1} <span className="text-ink-mute text-sm font-medium">/ {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%`, background: 'var(--turquoise)' }}
        />
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center mb-12">
        <div className="text-center mb-4">
           <span className="font-display text-xs tracking-[0.3em] font-semibold opacity-40">SOLVE:</span>
        </div>
        <div className="font-sans font-black text-6xl sm:text-8xl mb-8 tracking-tight" style={{ color: 'var(--ink)' }}>
          {currentQuestion.text}
        </div>
        
        <div className="flex items-center gap-4 h-20">
          <div 
            className="min-w-[120px] h-16 rounded-2xl flex items-center justify-center font-sans font-black text-4xl sm:text-5xl border-2 transition-all duration-200"
            style={{ 
              background: '#FFFFFF',
              borderColor: showPenalty 
                ? 'var(--pink)' 
                : (showSuccess ? 'var(--turquoise)' : (input ? 'var(--ink-soft)' : 'rgba(26,26,46,0.1)')),
              color: 'var(--ink)',
              boxShadow: showPenalty 
                ? '0 0 20px rgba(255,61,127,0.2)' 
                : (showSuccess ? '0 0 20px rgba(13,181,166,0.2)' : (input ? '0 4px 12px rgba(26,26,46,0.05)' : 'none')),
              transform: (showPenalty || showSuccess) ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {input || <span className="opacity-20">?</span>}
          </div>
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button
            key={n}
            onClick={() => handleKeyPress(n)}
            className="h-16 sm:h-20 rounded-2xl font-sans font-bold text-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
            style={{ color: 'var(--ink)' }}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleKeyPress(0)}
          className="col-span-2 h-16 sm:h-20 rounded-2xl font-sans font-bold text-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
          style={{ color: 'var(--ink)' }}
        >
          0
        </button>
        <button
          onClick={() => setInput('')}
          className="h-16 sm:h-20 rounded-2xl font-sans font-bold text-xl bg-white border border-slate-200 shadow-sm hover:bg-rose-50 hover:text-pink active:scale-95 transition-all"
          style={{ color: 'var(--ink-mute)' }}
        >
          C
        </button>
      </div>
    </div>
  );
}
