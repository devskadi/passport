import { useState } from 'react';
import OpeningAnimation from './components/OpeningAnimation';

export default function App() {
  const [phase, setPhase] = useState<'cover' | 'interior'>('cover');

  return (
    <OpeningAnimation
      phase={phase}
      onOpen={() => setPhase('interior')}
    />
  );
}
