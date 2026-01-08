'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import type { ExportFormat, ExportOptions } from '@/lib/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  isExporting: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

interface QualityPreset {
  id: string;
  label: string;
  quality: number;
  description: string;
  sizeRatio: number; // Compression ratio relative to base JPEG
}

const QUALITY_PRESETS: QualityPreset[] = [
  {
    id: 'max',
    label: 'Maximum',
    quality: 100,
    description: 'Best quality, largest file',
    sizeRatio: 1.0,
  },
  {
    id: 'high',
    label: 'High',
    quality: 85,
    description: 'Recommended for most uses',
    sizeRatio: 0.6,
  },
  {
    id: 'medium',
    label: 'Medium',
    quality: 70,
    description: 'Good balance of quality and size',
    sizeRatio: 0.4,
  },
  {
    id: 'low',
    label: 'Small',
    quality: 50,
    description: 'Smaller file, visible compression',
    sizeRatio: 0.25,
  },
];

// Estimate file size in MB based on canvas dimensions
function estimateFileSize(
  width: number,
  height: number,
  format: 'png' | 'jpeg',
  jpegQualityRatio: number = 1.0
): string {
  // 2x retina export
  const pixelCount = width * 2 * height * 2;

  // Base estimates (bytes per pixel based on typical compression)
  // PNG: ~0.5-2 bytes per pixel depending on content complexity
  // JPEG 100%: ~0.3-0.8 bytes per pixel
  const pngBytesPerPixel = 1.2; // Average estimate
  const jpegBaseBytesPerPixel = 0.5; // Base for quality 100

  let sizeInBytes: number;

  if (format === 'png') {
    sizeInBytes = pixelCount * pngBytesPerPixel;
  } else {
    sizeInBytes = pixelCount * jpegBaseBytesPerPixel * jpegQualityRatio;
  }

  const sizeInMB = sizeInBytes / (1024 * 1024);

  if (sizeInMB < 1) {
    return `~${Math.round(sizeInMB * 1000)}KB`;
  }
  return `~${sizeInMB.toFixed(1)}MB`;
}

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting,
  canvasWidth,
  canvasHeight,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [selectedPreset, setSelectedPreset] = useState<string>('high');

  const handleExport = () => {
    const preset = QUALITY_PRESETS.find((p) => p.id === selectedPreset);
    onExport({
      format,
      quality: preset?.quality ?? 85,
    });
  };

  const selectedQualityPreset = QUALITY_PRESETS.find((p) => p.id === selectedPreset);

  // Calculate estimated file sizes
  const pngSizeEstimate = useMemo(
    () => estimateFileSize(canvasWidth, canvasHeight, 'png'),
    [canvasWidth, canvasHeight]
  );

  const jpegSizeEstimates = useMemo(
    () =>
      QUALITY_PRESETS.reduce(
        (acc, preset) => {
          acc[preset.id] = estimateFileSize(canvasWidth, canvasHeight, 'jpeg', preset.sizeRatio);
          return acc;
        },
        {} as Record<string, string>
      ),
    [canvasWidth, canvasHeight]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-md p-6 rounded-2xl shadow-2xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Export Image
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Info */}
            <div
              className="mb-6 px-4 py-3 rounded-lg"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Output Size
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {canvasWidth * 2} × {canvasHeight * 2}px
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  2x Retina export
                </span>
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label
                className="text-xs font-medium uppercase tracking-wider mb-3 block"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormat('png')}
                  className="flex flex-col p-4 rounded-xl transition-all text-left"
                  style={{
                    background: format === 'png' ? 'var(--active-bg)' : 'var(--bg-tertiary)',
                    border: `2px solid ${format === 'png' ? 'var(--accent-warm)' : 'transparent'}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      PNG
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {pngSizeEstimate}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Lossless, transparent
                  </p>
                </button>

                <button
                  onClick={() => setFormat('jpeg')}
                  className="flex flex-col p-4 rounded-xl transition-all text-left"
                  style={{
                    background: format === 'jpeg' ? 'var(--active-bg)' : 'var(--bg-tertiary)',
                    border: `2px solid ${format === 'jpeg' ? 'var(--accent-warm)' : 'transparent'}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      JPEG
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {jpegSizeEstimates[selectedPreset]}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Compressed, smaller
                  </p>
                </button>
              </div>
            </div>

            {/* Quality Presets (JPEG only) */}
            <AnimatePresence>
              {format === 'jpeg' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-6"
                >
                  <label
                    className="text-xs font-medium uppercase tracking-wider mb-3 block"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Quality
                  </label>
                  <div className="space-y-2">
                    {QUALITY_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                        style={{
                          background: selectedPreset === preset.id ? 'var(--active-bg)' : 'var(--bg-tertiary)',
                          border: `1px solid ${selectedPreset === preset.id ? 'var(--border-strong)' : 'transparent'}`,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: selectedPreset === preset.id ? 'var(--accent-warm)' : 'var(--border-default)',
                          }}
                        >
                          {selectedPreset === preset.id && (
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: 'var(--accent-warm)' }}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm font-medium"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {preset.label}
                            </span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                background: 'var(--bg-elevated)',
                                color: 'var(--text-tertiary)',
                              }}
                            >
                              {preset.quality}%
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {preset.description}
                          </p>
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {jpegSizeEstimates[preset.id]}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-sm transition-all"
              style={{
                background: isExporting ? 'var(--bg-tertiary)' : 'var(--text-primary)',
                color: isExporting ? 'var(--text-tertiary)' : 'var(--bg-primary)',
                opacity: isExporting ? 0.5 : 1,
                cursor: isExporting ? 'not-allowed' : 'pointer',
              }}
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting
                  ? 'Exporting...'
                  : format === 'png'
                  ? 'Export PNG'
                  : `Export JPEG (${selectedQualityPreset?.label})`}
              </span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
