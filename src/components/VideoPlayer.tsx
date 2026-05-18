import { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';

function overStr(balls: number) {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

interface Props {
  landscape?: boolean;
}

export default function VideoPlayer({ landscape = false }: Props) {
  const { match } = useGame();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(m => !m);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const phaseColor =
    match.phase === 'live' ? 'bg-red-500' :
    match.phase === 'timeout' ? 'bg-yellow-500' : 'bg-blue-500';

  const phaseLabel =
    match.phase === 'live' ? 'LIVE' :
    match.phase === 'timeout' ? 'TIMEOUT' : 'BREAK';

  return (
    <div
      ref={containerRef}
      className="relative bg-black overflow-hidden"
      style={landscape
        ? { width: '100%', height: '100%' }
        : { width: '100%', aspectRatio: '16/9' }
      }
    >
      {/* Poster / background image always visible */}
      <img
        src="https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1280"
        alt="cricket match"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: playing ? 'none' : 'block' }}
      />

      {/* Video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        muted={muted}
        style={{ display: playing ? 'block' : 'none' }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-3 pt-2 gap-2">
        {/* Live badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`w-2 h-2 rounded-full ${phaseColor} animate-pulse flex-shrink-0`} />
          <span className="text-white text-xs font-black tracking-wider">{phaseLabel}</span>
        </div>

        {/* Score pill */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(10,14,26,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(148,163,184,0.15)' }}
        >
          <span className="font-heading font-black text-white text-sm">
            CSK {match.score}/{match.wickets}
          </span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-slate-300 text-xs font-mono">{overStr(match.balls)} ov</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={toggleMute}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70 transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70 transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          >
            {fullscreen ? '⤡' : '⤢'}
          </button>
        </div>
      </div>

      {/* Play / pause tap target */}
      <button
        onClick={toggle}
        className="absolute inset-0 flex items-center justify-center group"
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 border border-white/20 ${
            playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        >
          <span className="text-white text-xl">{playing ? '⏸' : '▶'}</span>
        </div>
      </button>

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-3 pb-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-300 font-medium drop-shadow">
            🦁 CSK <span className="text-teal-400">vs</span> 👑 RCB
          </span>
          <span className="text-xs text-teal-400 font-bold drop-shadow">
            RR: {match.runRate}
          </span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span className="text-xs text-white font-semibold">HD</span>
        </div>
      </div>
    </div>
  );
}
