export const DIFFICULTY_CONFIG = {
  easy: {
    name: 'Easy',
    operations: ['+', '-'],
    maxA: 20,
    maxB: 10,
    count: 20
  },
  normal: {
    name: 'Normal',
    operations: ['+', '-', '*', '/'],
    maxA: 50,
    maxB: 12,
    count: 20
  },
  hard: {
    name: 'Hard',
    operations: ['+', '-', '*', '/'],
    maxA: 100,
    maxB: 20,
    count: 20
  }
};

export function generateQuestions(difficulty = 'normal') {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;
  const { operations, maxA, maxB, count } = config;
  const questions = [];

  for (let i = 0; i < count; i++) {
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer;

    if (op === '+') {
      a = Math.floor(Math.random() * maxA) + 1;
      b = Math.floor(Math.random() * maxB) + 1;
      answer = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * maxA) + 1;
      b = Math.floor(Math.random() * Math.min(a, maxB)) + 1; // No negatives
      answer = a - b;
    } else if (op === '*') {
      a = Math.floor(Math.random() * maxA) + 1;
      b = Math.floor(Math.random() * maxB) + 1;
      answer = a * b;
    } else if (op === '/') {
      // For division, we pre-calculate to ensure integer results
      answer = Math.floor(Math.random() * maxB) + 1;
      b = Math.floor(Math.random() * maxB) + 1;
      a = answer * b;
    }

    questions.push({
      id: i,
      a,
      b,
      op,
      answer,
      text: `${a} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${b}`
    });
  }

  return questions;
}
