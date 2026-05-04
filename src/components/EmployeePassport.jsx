import React, { useState } from 'react';
import {
  Map,
  UserCheck,
  Calculator,
  Plane,
  Camera,
  Mic,
  FileText,
  Gamepad2,
  ClipboardList,
  DoorOpen,
  Compass,
  RotateCcw
} from 'lucide-react';
import AttendanceForm from './AttendanceForm.jsx';

export default function EmployeePassport() {
  const [phase, setPhase] = useState('closed'); // 'closed' | 'opening' | 'open'
  const [activeTab, setActiveTab] = useState('itinerary');

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    setTimeout(() => setPhase('open'), 1500);
  };

  const handleReset = () => {
    setPhase('closed');
    setActiveTab('itinerary');
  };

  // Vibrant palette cycled across stops for variety
  const accentCycle = ['coral', 'turquoise', 'yellow', 'pink'];

  const itinerary = [
    { n: 1, name: 'The Gateway Port', sub: 'Office Entrance / Guard Station', icon: 'gate' },
    { n: 2, name: 'The Grand Hall', sub: 'Events Hall — Waiting Lounge · Photobooth', icon: 'camera' },
    { n: 3, name: 'The Grand Hall', sub: 'Opening Program', icon: 'mic' },
    { n: 4, name: "The Explorer's Agreement", sub: 'NDA & Training Agreement', icon: 'doc' },
    { n: 5, name: 'Mini-Games', sub: 'Activity Block', icon: 'game' },
    { n: 6, name: "Explorer's Assessment", sub: 'Training Area', icon: 'check' },
    { n: 7, name: 'The Departure Gate', sub: 'Exit Area', icon: 'plane' }
  ];

  const accentColor = (key) => {
    const map = {
      coral: { bg: '#FF6B4A', dark: '#E84A2A', soft: 'rgba(255,107,74,0.12)' },
      turquoise: { bg: '#0DB5A6', dark: '#008B7E', soft: 'rgba(13,181,166,0.12)' },
      yellow: { bg: '#FFC93C', dark: '#E5A800', soft: 'rgba(255,201,60,0.18)' },
      pink: { bg: '#FF3D7F', dark: '#D6225E', soft: 'rgba(255,61,127,0.12)' }
    };
    return map[key];
  };

  const stopIcon = (type, size = 22) => {
    const props = { size, strokeWidth: 1.7 };
    switch (type) {
      case 'gate': return <DoorOpen {...props} />;
      case 'camera': return <Camera {...props} />;
      case 'mic': return <Mic {...props} />;
      case 'doc': return <FileText {...props} />;
      case 'game': return <Gamepad2 {...props} />;
      case 'check': return <ClipboardList {...props} />;
      case 'plane': return <Plane {...props} />;
      default: return null;
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #1A1A2E 0%, #0F0F1F 100%)',
        fontFamily: '"DM Sans", system-ui, sans-serif'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@500;700&display=swap');

        :root {
          --cream: #FFF8EC;
          --cream-warm: #FFF1DD;
          --coral: #FF6B4A;
          --coral-dark: #E84A2A;
          --turquoise: #0DB5A6;
          --turquoise-dark: #008B7E;
          --yellow: #FFC93C;
          --yellow-dark: #E5A800;
          --pink: #FF3D7F;
          --pink-dark: #D6225E;
          --ink: #1A1A2E;
          --ink-soft: #4A4A5E;
          --ink-mute: #8A8AA0;
        }

        .paper-bg {
          background-color: var(--cream);
          background-image:
            radial-gradient(at 10% 15%, rgba(255,107,74,0.08) 0px, transparent 50%),
            radial-gradient(at 90% 85%, rgba(13,181,166,0.07) 0px, transparent 50%),
            radial-gradient(at 50% 50%, transparent 65%, rgba(26,26,46,0.05) 100%);
        }

        .cover-bg {
          background:
            radial-gradient(at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 55%),
            linear-gradient(135deg, #FF6B4A 0%, #E84A2A 100%);
          position: relative;
        }
        .cover-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          pointer-events: none;
          border-radius: inherit;
        }

        @keyframes coverFlip {
          0% { transform: rotateY(0deg); opacity: 1; }
          40% { transform: rotateY(-75deg); opacity: 0.95; }
          80% { transform: rotateY(-150deg); opacity: 0.5; }
          100% { transform: rotateY(-175deg); opacity: 0; }
        }
        @keyframes interiorReveal {
          0% { opacity: 0; transform: scale(0.65); filter: blur(6px); }
          60% { opacity: 0.85; }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes stampDrop {
          0% { opacity: 0; transform: translateY(-20px) scale(0.85); }
          70% { opacity: 1; transform: translateY(3px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tabRise {
          0% { opacity: 0; transform: translateX(-50%) translateY(40px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes tagSway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes coverIdle {
          0%, 100% { transform: rotate(-1.5deg) translateY(0); }
          50% { transform: rotate(-1deg) translateY(-4px); }
        }
        @keyframes pageRise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        .anim-flip { animation: coverFlip 1.3s cubic-bezier(0.6, 0, 0.4, 1) forwards; transform-origin: left center; }
        .anim-reveal { animation: interiorReveal 1.1s cubic-bezier(0.2, 0.6, 0.2, 1) 0.5s both; }
        .anim-tab-rise { animation: tabRise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 1.1s both; }
        .anim-tag-sway { animation: tagSway 3s ease-in-out infinite; transform-origin: top center; }
        .anim-cover-idle { animation: coverIdle 4s ease-in-out infinite; }
        .anim-page-rise { animation: pageRise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .anim-line-grow { animation: lineGrow 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 1.0s both; transform-origin: top center; }
        .stamp-drop { animation: stampDrop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }

        .font-display { font-family: 'Fraunces', Georgia, serif; font-variation-settings: "opsz" 144; }
        .font-hand { font-family: 'Caveat', cursive; }

        .cover-stitch {
          border: 1.5px dashed rgba(255,248,236,0.55);
          border-radius: 10px;
        }

        .stamp-card {
          background: #FFFFFF;
          border: 1.5px solid rgba(26,26,46,0.08);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.6) inset,
            0 2px 4px rgba(26,26,46,0.04),
            0 12px 28px -10px rgba(26,26,46,0.18);
        }

        .tab-pill {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(26,26,46,0.08);
          box-shadow:
            0 2px 0 rgba(255,255,255,0.5) inset,
            0 16px 36px -10px rgba(26,26,46,0.35),
            0 4px 12px -4px rgba(26,26,46,0.15);
        }

        .luggage-tag {
          background: linear-gradient(180deg, #FFD862 0%, #FFC93C 100%);
          color: var(--ink);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.5),
            0 4px 0 #C99300,
            0 8px 18px -4px rgba(26,26,46,0.5);
        }
        .luggage-tag:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.5),
            0 6px 0 #C99300,
            0 12px 24px -4px rgba(26,26,46,0.6);
        }
        .luggage-tag:active {
          transform: translateY(2px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.5),
            0 2px 0 #C99300,
            0 4px 8px -2px rgba(26,26,46,0.4);
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (prefers-reduced-motion: reduce) {
          .anim-flip, .anim-reveal, .anim-tab-rise, .anim-tag-sway, .anim-cover-idle, .anim-page-rise, .anim-line-grow, .stamp-drop {
            animation: none !important;
          }
          .anim-flip { opacity: 0 !important; }
        }
      `}</style>

      {phase === 'open' && (
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.95)',
            color: 'var(--ink-soft)',
            border: '1px solid rgba(26,26,46,0.1)'
          }}
          aria-label="Reset"
        >
          <RotateCcw size={12} strokeWidth={2} />
          Reset
        </button>
      )}

      {/* CLOSED + OPENING */}
      {phase !== 'open' && (
        <div
          className="relative flex flex-col items-center px-6"
          style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}
        >
          <div
            className="absolute"
            style={{
              bottom: '-30px',
              width: '85%',
              maxWidth: '320px',
              height: '40px',
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)',
              filter: 'blur(8px)',
              zIndex: 0
            }}
          />

          <div
            className={`relative ${phase === 'closed' ? 'anim-cover-idle' : ''} ${phase === 'opening' ? 'anim-flip' : ''}`}
            style={{
              width: 'min(85vw, 340px)',
              aspectRatio: '340 / 500',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              className="cover-bg w-full h-full rounded-lg flex flex-col items-center justify-between py-8 sm:py-12 px-6 sm:px-8 relative overflow-hidden"
              style={{
                boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.4), inset 0 0 80px rgba(0,0,0,0.18)'
              }}
            >
              <div className="absolute inset-3 sm:inset-4 cover-stitch pointer-events-none" />

              <div className="relative flex flex-col items-center mt-1">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2 sm:mb-3"
                  style={{
                    border: '2px solid var(--yellow)',
                    background: 'rgba(255,201,60,0.15)'
                  }}
                >
                  <Compass size={26} color="var(--yellow)" strokeWidth={1.5} />
                </div>
                <div
                  className="font-display text-[9px] sm:text-[10px] tracking-[0.4em]"
                  style={{ color: 'var(--yellow)' }}
                >
                  EST. DAY ONE
                </div>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div
                  className="font-display font-medium text-xs sm:text-sm tracking-[0.3em] mb-2 sm:mb-3"
                  style={{ color: 'var(--cream)', opacity: 0.95 }}
                >
                  EMPLOYEE
                </div>
                <div
                  className="font-display font-black text-4xl sm:text-5xl tracking-wide leading-none"
                  style={{
                    color: 'var(--cream)',
                    textShadow: '0 2px 0 rgba(0,0,0,0.2)'
                  }}
                >
                  PASSPORT
                </div>
                <div
                  className="mt-3 sm:mt-4 h-px w-24 sm:w-32"
                  style={{ background: 'var(--yellow)', opacity: 0.7 }}
                />
                <div
                  className="font-hand text-lg sm:text-xl mt-2 sm:mt-3"
                  style={{ color: 'var(--yellow)' }}
                >
                  a journey begins
                </div>
              </div>

              <div className="relative flex flex-col items-center gap-1 sm:gap-2">
                <div
                  className="font-display text-[9px] sm:text-[10px] tracking-[0.3em]"
                  style={{ color: 'var(--yellow)', opacity: 0.7 }}
                >
                  · · ·
                </div>
                <div
                  className="font-mono text-[9px] sm:text-[10px] tracking-widest"
                  style={{ color: 'rgba(255,248,236,0.55)' }}
                >
                  Nº 0001 / DAY-01
                </div>
              </div>
            </div>
          </div>

          {phase === 'closed' && (
            <div className="relative flex flex-col items-center mt-6 sm:mt-8">
              <div
                style={{
                  width: '2px',
                  height: '24px',
                  background: 'rgba(255,248,236,0.4)',
                  marginBottom: '-2px'
                }}
              />
              <div className="anim-tag-sway">
                <button
                  onClick={handleOpen}
                  className="luggage-tag relative px-7 sm:px-8 py-3.5 sm:py-4 rounded-lg font-display font-semibold text-base sm:text-lg transition-all duration-150"
                  style={{ minWidth: '180px' }}
                >
                  <span
                    className="absolute -top-2 left-1/2 w-3 h-3 rounded-full"
                    style={{
                      transform: 'translateX(-50%)',
                      background: '#0F0F1F',
                      border: '1px solid rgba(0,0,0,0.5)'
                    }}
                  />
                  <span className="relative">I'm ready</span>
                </button>
              </div>
              <div
                className="mt-5 sm:mt-6 font-hand text-sm sm:text-base"
                style={{ color: 'rgba(255,248,236,0.55)' }}
              >
                tap the tag to begin
              </div>
            </div>
          )}
        </div>
      )}

      {/* OPEN */}
      {phase !== 'closed' && (
        <div
          className={`absolute inset-0 paper-bg overflow-y-auto hide-scrollbar ${phase === 'opening' ? 'anim-reveal' : ''}`}
          style={{ zIndex: phase === 'opening' ? 1 : 'auto' }}
        >
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 60px rgba(26,26,46,0.12), inset 0 0 4px rgba(26,26,46,0.08)',
              zIndex: 1
            }}
          />

          {/* ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="relative max-w-2xl mx-auto px-5 sm:px-6 pt-10 sm:pt-12 pb-36 sm:pb-40">
              <div className="anim-page-rise text-center mb-8 sm:mb-10" style={{ animationDelay: '0.6s' }}>
                <div
                  className="font-display text-[10px] sm:text-[11px] tracking-[0.4em] mb-2"
                  style={{ color: 'var(--coral-dark)' }}
                >
                  · OFFICIAL ITINERARY ·
                </div>
                <h1
                  className="font-display font-black text-4xl sm:text-5xl mb-2 sm:mb-3"
                  style={{ color: 'var(--ink)' }}
                >
                  Your First Day
                </h1>
                <div className="font-hand text-xl sm:text-2xl" style={{ color: 'var(--turquoise-dark)' }}>
                  seven stops on the journey
                </div>
              </div>

              {/* Timeline — single column, line on left */}
              <div className="relative pl-10 sm:pl-12">
                <div
                  className="absolute top-2 bottom-2 anim-line-grow"
                  style={{
                    left: '15px',
                    width: '2px',
                    backgroundImage: 'linear-gradient(to bottom, var(--ink-mute) 50%, transparent 50%)',
                    backgroundSize: '2px 8px',
                    opacity: 0.4
                  }}
                />

                <div className="relative flex flex-col gap-5 sm:gap-6">
                  {itinerary.map((stop, i) => {
                    const accent = accentColor(accentCycle[i % accentCycle.length]);
                    return (
                      <div
                        key={stop.n}
                        className="relative stamp-drop"
                        style={{ animationDelay: `${1.0 + i * 0.1}s` }}
                      >
                        <div
                          className="absolute rounded-full"
                          style={{
                            left: '-32px',
                            top: '24px',
                            width: '14px',
                            height: '14px',
                            background: accent.bg,
                            border: '3px solid var(--cream)',
                            boxShadow: `0 0 0 1.5px ${accent.bg}, 0 2px 6px ${accent.bg}40`
                          }}
                        />

                        <div className="stamp-card rounded-xl overflow-hidden">
                          {/* Top strip — number + accent + icon */}
                          <div
                            className="flex items-center justify-between px-4 sm:px-5 py-3"
                            style={{ background: accent.soft, borderBottom: `1.5px solid ${accent.bg}30` }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="font-display font-black text-2xl sm:text-3xl leading-none flex items-center justify-center rounded-lg"
                                style={{
                                  background: accent.bg,
                                  color: '#FFFFFF',
                                  width: '44px',
                                  height: '44px',
                                  boxShadow: `0 4px 10px -2px ${accent.bg}66`
                                }}
                              >
                                {String(stop.n).padStart(2, '0')}
                              </div>
                              <div
                                className="font-display text-[10px] sm:text-[11px] tracking-[0.3em] font-semibold"
                                style={{ color: accent.dark }}
                              >
                                STOP
                              </div>
                            </div>
                            <div
                              className="flex items-center justify-center rounded-lg"
                              style={{
                                background: '#FFFFFF',
                                color: accent.dark,
                                width: '40px',
                                height: '40px',
                                border: `1.5px solid ${accent.bg}40`
                              }}
                            >
                              {stopIcon(stop.icon, 20)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="px-4 sm:px-5 py-4">
                            <h3
                              className="font-display font-bold text-lg sm:text-xl leading-tight mb-1"
                              style={{ color: 'var(--ink)' }}
                            >
                              {stop.name}
                            </h3>
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: 'var(--ink-soft)' }}
                            >
                              {stop.sub}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="anim-page-rise mt-10 sm:mt-12 text-center font-hand text-xl sm:text-2xl"
                style={{ animationDelay: '2.2s', color: 'var(--pink)' }}
              >
                ~ safe travels ~
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {activeTab === 'attendance' && <AttendanceForm />}

          {/* MATH WORKOUT */}
          {activeTab === 'workout' && (
            <div className="anim-page-rise relative max-w-3xl mx-auto px-5 sm:px-6 pt-10 sm:pt-12 pb-32 min-h-screen flex flex-col">
              <div className="text-center mb-5 sm:mb-6">
                <div
                  className="font-display text-[10px] sm:text-[11px] tracking-[0.4em] mb-2"
                  style={{ color: 'var(--pink)' }}
                >
                  · DAILY DRILLS ·
                </div>
                <h1
                  className="font-display font-black text-4xl sm:text-5xl mb-2"
                  style={{ color: 'var(--ink)' }}
                >
                  Math Workout
                </h1>
                <div className="font-hand text-lg sm:text-xl" style={{ color: 'var(--coral-dark)' }}>
                  warm up your reasoning muscles
                </div>
              </div>

              <div
                className="stamp-card rounded-2xl flex-1 flex flex-col overflow-hidden relative"
                style={{ minHeight: '480px' }}
              >
                <div
                  className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b"
                  style={{
                    background: 'rgba(13,181,166,0.06)',
                    borderColor: 'rgba(26,26,46,0.08)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--coral)' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--yellow)' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--turquoise)' }} />
                    </div>
                    <span
                      className="text-xs font-medium ml-2"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      math-workout.app
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider"
                    style={{ color: 'var(--ink-mute)' }}
                  >
                    iframe
                  </span>
                </div>

                {/*
                  DEV NOTE: replace this placeholder block with the real iframe:
                  <iframe src="https://your-math-app.example.com" className="w-full flex-1 border-0" />
                */}
                <div
                  className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center"
                  style={{
                    background:
                      'repeating-linear-gradient(45deg, rgba(13,181,166,0.04) 0px, rgba(13,181,166,0.04) 12px, transparent 12px, transparent 24px)'
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'var(--pink)', color: '#FFFFFF', boxShadow: '0 8px 20px -4px rgba(255,61,127,0.5)' }}
                  >
                    <Calculator size={32} strokeWidth={1.6} />
                  </div>
                  <h3
                    className="font-display font-bold text-xl sm:text-2xl mb-2"
                    style={{ color: 'var(--ink)' }}
                  >
                    Iframe slot
                  </h3>
                  <p
                    className="text-sm max-w-md leading-relaxed"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    The math drill web app will embed here. Dev team: drop an{' '}
                    <code
                      className="px-1.5 py-0.5 rounded text-xs"
                      style={{ background: 'rgba(13,181,166,0.12)', color: 'var(--turquoise-dark)' }}
                    >
                      &lt;iframe src="..."&gt;
                    </code>{' '}
                    into this container.
                  </p>
                  <div
                    className="mt-6 font-hand text-base"
                    style={{ color: 'var(--ink-mute)' }}
                  >
                    awaiting handoff
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FLOATING TAB BAR */}
          <div
            className="fixed bottom-4 sm:bottom-6 left-1/2 anim-tab-rise z-30 px-3"
            style={{ transform: 'translateX(-50%)', maxWidth: 'calc(100vw - 24px)' }}
          >
            <div className="tab-pill rounded-full p-1 sm:p-1.5 flex items-center gap-0.5 sm:gap-1">
              {[
                { id: 'itinerary', label: 'Itinerary', Icon: Map },
                { id: 'attendance', label: 'Attendance', Icon: UserCheck },
                { id: 'workout', label: 'Math Workout', Icon: Calculator }
              ].map(({ id, label, Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 font-display font-semibold text-xs sm:text-sm whitespace-nowrap"
                    style={{
                      background: active ? 'var(--turquoise)' : 'transparent',
                      color: active ? '#FFFFFF' : 'var(--ink-soft)',
                      boxShadow: active ? '0 4px 12px -2px rgba(13,181,166,0.55)' : 'none'
                    }}
                  >
                    <Icon size={15} strokeWidth={2.2} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
