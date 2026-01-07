'use client';

import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header
      className="h-14 flex items-center justify-between px-4 border-b"
      style={{
        background: 'var(--bg-primary)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--text-primary)' }}
        >
          <Sparkles className="w-4 h-4" style={{ color: 'var(--bg-primary)' }} />
        </div>
        <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          Mockit
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: 'var(--bg-tertiary)' }}>
            ⌘V
          </kbd>
          {' '}paste
        </span>
        <div className="w-px h-4 mx-2" style={{ background: 'var(--border-default)' }} />
        <ThemeToggle />
      </div>
    </header>
  );
}
