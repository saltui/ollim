'use client';

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
      <div className="flex items-center">
        <span
          className="text-lg font-bold tracking-wide"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          OLLIM
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
