import { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import type { PersonaId } from '../types';

const personas: { id: PersonaId; name: string; emoji: string; color: string; desc: string }[] = [
  { id: 'bollywood', name: 'Bollywood Bhai', emoji: '🎭', color: '#f97316', desc: 'Dramatic Hindi' },
  { id: 'comedy', name: 'Comedy Uncle', emoji: '😂', color: '#a855f7', desc: 'Sarcastic English' },
  { id: 'professor', name: 'The Professor', emoji: '🧠', color: '#3b82f6', desc: 'Tactical Analysis' },
  { id: 'dadi', name: 'Dadi Maa', emoji: '👵', color: '#ec4899', desc: 'Loving Dadi Hindi' },
  { id: 'hype', name: 'Hype Beast', emoji: '🔥', color: '#22c55e', desc: 'Gen-Z Slang' },
];

export default function AITalkTab() {
  const { commentaryFeed, activePersona, setActivePersona } = useGame();
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [commentaryFeed.length]);

  const persona = personas.find(p => p.id === activePersona)!;

  return (
    <div className="animate-fade-in pb-2 h-full flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="font-heading text-xl font-black text-white">🎙️ AI Commentary</h2>
        <p className="text-slate-400 text-xs mt-0.5">Live commentary in your chosen persona</p>
      </div>

      {/* Persona selector */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {personas.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePersona(p.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              activePersona === p.id
                ? 'text-white border-transparent shadow-lg'
                : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:text-slate-200'
            }`}
            style={activePersona === p.id ? { background: `linear-gradient(135deg, ${p.color}cc, ${p.color}88)`, boxShadow: `0 4px 16px ${p.color}33` } : {}}
          >
            <span>{p.emoji}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Active persona banner */}
      <div
        className="mx-4 mb-3 p-3 rounded-2xl flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${persona.color}20, ${persona.color}10)`, border: `1px solid ${persona.color}30` }}
      >
        <span className="text-2xl">{persona.emoji}</span>
        <div>
          <p className="font-heading text-sm font-bold text-white">{persona.name}</p>
          <p className="text-xs" style={{ color: persona.color }}>{persona.desc}</p>
        </div>
      </div>

      {/* Commentary feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto px-4 flex flex-col gap-2 no-scrollbar">
        {commentaryFeed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">🎙️</span>
            <p className="text-slate-400 text-sm">Commentary will appear as the match progresses...</p>
          </div>
        ) : (
          commentaryFeed.map(entry => {
            const p = personas.find(x => x.id === entry.personaId)!;
            return (
              <div
                key={entry.id}
                className="glass p-3 animate-slide-up"
                style={{ borderLeft: `3px solid ${p.color}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{p.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-xs text-slate-500 ml-auto">Ball {entry.ball}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{entry.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
