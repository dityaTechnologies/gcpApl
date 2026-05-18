import { useState, useCallback, useEffect, useRef } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import SplashScreen from './components/SplashScreen';
import ScoreHeader from './components/ScoreHeader';
import TabNav from './components/TabNav';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/ToastContainer';
import VideoPlayer from './components/VideoPlayer';
import PredictTab from './tabs/PredictTab';
import QuickXITab from './tabs/QuickXITab';
import QuizTab from './tabs/QuizTab';
import TicTacToeTab from './tabs/TicTacToeTab';
import HousieTab from './tabs/HousieTab';
import AITalkTab from './tabs/AITalkTab';
import StocksTab from './tabs/StocksTab';
import ShopTab from './tabs/ShopTab';
import LeaderboardTab from './tabs/LeaderboardTab';
import type { TabId } from './types';

/* ─── orientation hook ─────────────────────────────────────────────────── */
function useIsLandscape() {
  const [landscape, setLandscape] = useState(() => window.innerWidth > window.innerHeight);
  useEffect(() => {
    const update = () => setLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener('resize', update);
    const mq = window.matchMedia('(orientation: landscape)');
    mq.addEventListener('change', update);
    return () => { window.removeEventListener('resize', update); mq.removeEventListener('change', update); };
  }, []);
  return landscape;
}

/* ─── tab content ───────────────────────────────────────────────────────── */
function TabContent({ activeTab }: { activeTab: TabId }) {
  switch (activeTab) {
    case 'predict':     return <PredictTab />;
    case 'quickxi':     return <QuickXITab />;
    case 'quiz':        return <QuizTab />;
    case 'tictactoe':   return <TicTacToeTab />;
    case 'housie':      return <HousieTab />;
    case 'aitalk':      return <AITalkTab />;
    case 'stocks':      return <StocksTab />;
    case 'shop':        return <ShopTab />;
    case 'leaderboard': return <LeaderboardTab />;
  }
}

/* ─── sidebar tab list ─────────────────────────────────────────────────── */
const SIDEBAR_TABS: { id: TabId; emoji: string; label: string }[] = [
  { id: 'predict',     emoji: '🎯', label: 'Predict' },
  { id: 'quickxi',     emoji: '👥', label: 'Quick XI' },
  { id: 'quiz',        emoji: '❓', label: 'Quiz' },
  { id: 'tictactoe',   emoji: '❌', label: 'TicTacToe' },
  { id: 'housie',      emoji: '🎱', label: 'Housie' },
  { id: 'aitalk',      emoji: '🎙️', label: 'AI Talk' },
  { id: 'stocks',      emoji: '📈', label: 'Stocks' },
  { id: 'shop',        emoji: '🛍️', label: 'Shop' },
  { id: 'leaderboard', emoji: '🏆', label: 'Board' },
];

/* ─── PORTRAIT LAYOUT ───────────────────────────────────────────────────── */
function PortraitLayout() {
  const [activeTab, setActiveTab] = useState<TabId>('predict');

  // We need to know the pixel height the sticky header occupies so the
  // scroll container can start exactly below it.
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(0);

  useEffect(() => {
    if (!headerRef.current) return;
    const ro = new ResizeObserver(() => {
      setHeaderH(headerRef.current?.offsetHeight ?? 0);
    });
    ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="flex justify-center"
      style={{ background: '#0a0e1a', height: '100dvh', overflow: 'hidden' }}
    >
      {/* Constrain to phone width */}
      <div className="w-full max-w-[480px] flex flex-col" style={{ height: '100%', position: 'relative' }}>
        <ToastContainer />

        {/* ── Fixed header block: video + score + tabs ── */}
        <div
          ref={headerRef}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 }}
        >
          <VideoPlayer />
          <ScoreHeader />
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>

        {/* ── Scrollable content — pushed down by header height ── */}
        <div
          style={{
            position: 'absolute',
            top: headerH,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '72px', // bottom nav clearance
          }}
        >
          <div key={activeTab} className="animate-slide-up">
            <TabContent activeTab={activeTab} />
          </div>
        </div>

        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}

/* ─── LANDSCAPE LAYOUT ──────────────────────────────────────────────────── */

const PANEL_WIDTH = 320; // px — expanded side panel
const BAR_WIDTH   = 52;  // px — collapsed icon bar

function LandscapeLayout() {
  const [activeTab, setActiveTab]   = useState<TabId>('predict');
  const [panelOpen, setPanelOpen]   = useState(false);
  const { stats } = useGame();

  const togglePanel = useCallback(() => setPanelOpen(o => !o), []);
  const selectTab   = useCallback((id: TabId) => { setActiveTab(id); setPanelOpen(true); }, []);

  return (
    <div
      style={{
        width: '100vw', height: '100dvh',
        background: '#0a0e1a',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ToastContainer />

      {/* ── Video — fills everything behind the panel ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <VideoPlayer landscape />
      </div>

      {/* ── Right edge: icon bar + sliding panel ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          zIndex: 30,
        }}
      >
        {/* Expanded panel — slides in/out */}
        <div
          style={{
            width: PANEL_WIDTH,
            transform: panelOpen ? 'translateX(0)' : `translateX(${PANEL_WIDTH}px)`,
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(10,14,26,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderLeft: '1px solid rgba(148,163,184,0.12)',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px 8px',
              borderBottom: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <span className="font-heading text-sm font-black gradient-text">CrickPulse</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="text-[10px] text-yellow-400 font-bold">🪙{stats.coins}</span>
              <span className="text-[10px] text-orange-400 font-bold">🔥{stats.streak}</span>
              <button
                onClick={togglePanel}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
                style={{ fontSize: 14, flexShrink: 0 }}
                title="Collapse"
              >
                ›
              </button>
            </div>
          </div>

          {/* Horizontal mini tab strip inside panel */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              overflowX: 'auto',
              gap: 4,
              padding: '6px 8px',
              borderBottom: '1px solid rgba(148,163,184,0.08)',
              scrollbarWidth: 'none',
            }}
          >
            {SIDEBAR_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
                  activeTab === t.id
                    ? 'gradient-bg text-white shadow-teal-500/20 shadow-md'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/40'
                }`}
                style={{ minWidth: 44 }}
              >
                <span style={{ fontSize: 14 }}>{t.emoji}</span>
                <span style={{ fontSize: 9, fontWeight: 600, lineHeight: 1 }}>{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', minHeight: 0 }}>
            <div key={activeTab} className="animate-slide-up">
              <TabContent activeTab={activeTab} />
            </div>
          </div>
        </div>

        {/* ── Persistent icon bar (always visible) ── */}
        <div
          style={{
            width: BAR_WIDTH,
            height: '100%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(10,14,26,0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderLeft: '1px solid rgba(148,163,184,0.1)',
          }}
        >
          {/* Toggle arrow */}
          <button
            onClick={togglePanel}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 10, marginBottom: 6,
              fontSize: 16, color: '#00d4aa',
              background: 'rgba(0,212,170,0.12)',
              border: '1px solid rgba(0,212,170,0.3)',
              flexShrink: 0,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            title={panelOpen ? 'Collapse' : 'Open features'}
          >
            {panelOpen ? '›' : '‹'}
          </button>

          {/* Divider */}
          <div style={{ width: 28, height: 1, background: 'rgba(148,163,184,0.15)', marginBottom: 4 }} />

          {/* Tab icons */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', width: '100%' }}>
            {SIDEBAR_TABS.map(t => {
              const isActive = activeTab === t.id && panelOpen;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTab(t.id)}
                  title={t.label}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    padding: '8px 4px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(0,212,170,0.15)' : 'transparent',
                    borderLeft: isActive ? '2px solid #00d4aa' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{t.emoji}</span>
                  <span style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: isActive ? '#00d4aa' : 'rgba(148,163,184,0.6)',
                    lineHeight: 1,
                    letterSpacing: '0.02em',
                  }}>
                    {t.label.split(' ')[0].toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom coins/streak mini display */}
          <div style={{ paddingBottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 28, height: 1, background: 'rgba(148,163,184,0.15)', marginBottom: 2 }} />
            <span style={{ fontSize: 11 }}>🪙</span>
            <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700 }}>{stats.coins}</span>
            <span style={{ fontSize: 11 }}>🔥</span>
            <span style={{ fontSize: 9, color: '#fb923c', fontWeight: 700 }}>{stats.streak}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── root ─────────────────────────────────────────────────────────────── */
function AppContent() {
  const landscape = useIsLandscape();
  return landscape ? <LandscapeLayout /> : <PortraitLayout />;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  return (
    <GameProvider>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      {splashDone && <AppContent />}
    </GameProvider>
  );
}
