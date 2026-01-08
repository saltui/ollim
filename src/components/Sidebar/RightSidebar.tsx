'use client';

import { Download, ZoomIn, ZoomOut, Maximize2, Smartphone } from 'lucide-react';
import { CANVAS_SIZES } from '@/lib/constants';

interface RightSidebarProps {
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  mockupScale: number;
  onZoomChange: (value: number) => void;
  onCanvasSizeChange: (width: number, height: number) => void;
  onMockupScaleChange: (value: number) => void;
  onExportClick: () => void;
  isExporting: boolean;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
      {children}
    </h3>
  );
}

function IconButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg transition-colors"
      style={{
        background: 'var(--bg-tertiary)',
        color: 'var(--text-secondary)',
      }}
    >
      {children}
    </button>
  );
}

export function RightSidebar({
  zoom,
  canvasWidth,
  canvasHeight,
  mockupScale,
  onZoomChange,
  onCanvasSizeChange,
  onMockupScaleChange,
  onExportClick,
  isExporting,
}: RightSidebarProps) {
  const currentPreset = CANVAS_SIZES.find(
    (size) => size.width === canvasWidth && size.height === canvasHeight
  );

  return (
    <aside
      className="w-[260px] flex flex-col overflow-hidden border-l"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Mockup Scale */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Mockup Size</SectionTitle>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {mockupScale}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconButton onClick={() => onMockupScaleChange(Math.max(25, mockupScale - 25))}>
              <Smartphone className="w-3.5 h-3.5" />
            </IconButton>
            <input
              type="range"
              min="25"
              max="200"
              step="5"
              value={mockupScale}
              onChange={(e) => onMockupScaleChange(Number(e.target.value))}
              className="flex-1"
            />
            <IconButton onClick={() => onMockupScaleChange(Math.min(200, mockupScale + 25))}>
              <Smartphone className="w-4 h-4" />
            </IconButton>
          </div>
        </section>

        {/* Zoom Controls */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Preview Zoom</SectionTitle>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {zoom}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconButton onClick={() => onZoomChange(Math.max(25, zoom - 25))}>
              <ZoomOut className="w-4 h-4" />
            </IconButton>
            <input
              type="range"
              min="25"
              max="200"
              step="25"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="flex-1"
            />
            <IconButton onClick={() => onZoomChange(Math.min(200, zoom + 25))}>
              <ZoomIn className="w-4 h-4" />
            </IconButton>
          </div>
        </section>

        {/* Canvas Size */}
        <section>
          <SectionTitle>Canvas Size</SectionTitle>
          <div className="space-y-1">
            {CANVAS_SIZES.map((size) => (
              <button
                key={size.label}
                onClick={() => onCanvasSizeChange(size.width, size.height)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left"
                style={{
                  background: currentPreset?.label === size.label ? 'var(--active-bg)' : 'transparent',
                  color: currentPreset?.label === size.label ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="text-sm">{size.label}</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {size.width}×{size.height}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Size */}
        <section>
          <SectionTitle>Custom Size</SectionTitle>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                Width
              </label>
              <input
                type="number"
                value={canvasWidth}
                onChange={(e) => onCanvasSizeChange(Number(e.target.value), canvasHeight)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                Height
              </label>
              <input
                type="number"
                value={canvasHeight}
                onChange={(e) => onCanvasSizeChange(canvasWidth, Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Export Button */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={onExportClick}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all"
          style={{
            background: isExporting ? 'var(--bg-tertiary)' : 'var(--text-primary)',
            color: isExporting ? 'var(--text-tertiary)' : 'var(--bg-primary)',
            opacity: isExporting ? 0.5 : 1,
            cursor: isExporting ? 'not-allowed' : 'pointer',
          }}
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>
      </div>
    </aside>
  );
}
