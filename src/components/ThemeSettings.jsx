import React from 'react';
import { FiX } from 'react-icons/fi';

const THEMES = [
  { id: 'indigo',  label: 'Indigo',  color: '#6366f1' },
  { id: 'violet',  label: 'Violet',  color: '#8b5cf6' },
  { id: 'rose',    label: 'Rose',    color: '#f43f5e' },
  { id: 'emerald', label: 'Emerald', color: '#10b981' },
  { id: 'amber',   label: 'Amber',   color: '#f59e0b' },
  { id: 'cyan',    label: 'Cyan',    color: '#06b6d4' },
];

const FONTS = [
  { id: 'inter',  label: 'Inter',    preview: 'Aa' },
  { id: 'mono',   label: 'Mono',     preview: 'Aa' },
  { id: 'serif',  label: 'Serif',    preview: 'Aa' },
  { id: 'system', label: 'System',   preview: 'Aa' },
];

export default function ThemeSettings({ theme, font, setTheme, setFont, themeMode, setThemeMode, onClose }) {
  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl z-50">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black text-slate-200 uppercase tracking-widest">Appearance</p>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer">
          <FiX size={14} />
        </button>
      </div>

      {/* Theme Mode Segment */}
      <div className="mb-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Theme Mode</p>
        <div className="grid grid-cols-2 gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-700/40">
          <button 
            onClick={() => setThemeMode('dark')}
            className={`py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              themeMode === 'dark' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dark
          </button>
          <button 
            onClick={() => setThemeMode('light')}
            className={`py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              themeMode === 'light' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Light
          </button>
        </div>
      </div>

      {/* Theme Colors */}
      <div className="mb-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Accent Color</p>
        <div className="grid grid-cols-6 gap-1.5">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              className="relative w-full aspect-square rounded-lg cursor-pointer transition-all hover:scale-110 active:scale-95"
              style={{ backgroundColor: t.color }}
            >
              {theme === t.id && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-black">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Font Style</p>
        <div className="grid grid-cols-2 gap-1.5">
          {FONTS.map(f => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                font === f.id
                  ? 'bg-slate-700 border-slate-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
              style={{ fontFamily: f.id === 'mono' ? 'monospace' : f.id === 'serif' ? 'serif' : 'inherit' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
