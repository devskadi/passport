import { useRef, useState } from 'react';
import Cover from './components/Cover';
import OpeningAnimation from './components/OpeningAnimation';
import PassportInterior from './components/PassportInterior';
import { usePassportState } from './hooks/usePassportState';

export default function App() {
  const { state, stampStop, markCoverOpened, setSoundEnabled, resetAll } =
    usePassportState();

  // Returning visitors (state.hasOpenedCover) skip the cover entirely.
  // Capture once so changes mid-session don't snap us back to the cover.
  const initialPhase = useRef<'cover' | 'interior'>(
    state.hasOpenedCover ? 'interior' : 'cover'
  ).current;
  const [phase, setPhase] = useState<'cover' | 'interior'>(initialPhase);

  const handleOpen = () => {
    markCoverOpened();
    setPhase('interior');
  };

  const handleReset = () => {
    if (window.confirm('Clear all stamps and reopen the passport?')) {
      resetAll();
      window.location.reload();
    }
  };

  return (
    <OpeningAnimation
      phase={phase}
      initialPhase={initialPhase}
      cover={<Cover onOpen={handleOpen} />}
      interior={
        <PassportInterior
          stamps={state.stamps}
          onStamp={stampStop}
          soundEnabled={state.soundEnabled}
          onToggleSound={() => setSoundEnabled(!state.soundEnabled)}
          onReset={handleReset}
        />
      }
    />
  );
}
