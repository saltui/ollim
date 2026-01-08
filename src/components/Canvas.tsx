'use client';

import { forwardRef, useState, useEffect, useRef as useReactRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImagePlus } from 'lucide-react';
import { useDrop } from '@/hooks/useDrop';
import { IPhoneFrame, BrowserFrame, PixelFrame } from './devices';
import type { DeviceType, IPhoneModel, IPhoneColor, PixelModel, PixelColor } from '@/lib/types';

interface NoneFrameProps {
  image: string | null;
  shadowIntensity: number;
  onImageSelect: (image: string) => void;
}

function NoneFrame({ image, shadowIntensity, onImageSelect }: NoneFrameProps) {
  const fileInputRef = useReactRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          onImageSelect(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const shadowOpacity = shadowIntensity / 100;
  const shadowBlur = 20 + (shadowIntensity * 0.8);
  const shadowSpread = shadowIntensity * 0.3;

  if (image) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative cursor-pointer group"
        style={{
          filter: `drop-shadow(0 ${shadowSpread}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`,
        }}
        onClick={handleClick}
      >
        <img
          src={image}
          alt="Screenshot"
          style={{ borderRadius: '12px' }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm">
          <div className="text-center">
            <ImagePlus className="w-6 h-6 text-white mb-1 mx-auto" />
            <p className="text-white text-xs font-medium">Change</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-64 h-64 rounded-xl cursor-pointer transition-all"
      style={{
        background: 'var(--bg-tertiary)',
        border: '2px dashed var(--border-default)',
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
    >
      <ImagePlus className="w-8 h-8 mb-2" style={{ color: 'var(--text-tertiary)' }} />
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Select Image</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Click to upload</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
}

interface CanvasProps {
  image: string | null;
  deviceType: DeviceType;
  background: string;
  shadowIntensity: number;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  iphoneModel: IPhoneModel;
  iphoneColor: IPhoneColor;
  pixelModel: PixelModel;
  pixelColor: PixelColor;
  mockupScale: number;
  onImageChange: (image: string) => void;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  function Canvas(
    { image, deviceType, background, shadowIntensity, zoom, canvasWidth, canvasHeight, iphoneModel, iphoneColor, pixelModel, pixelColor, mockupScale, onImageChange },
    ref
  ) {
    const containerRef = useReactRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);
    const { isDragging, dragProps } = useDrop(onImageChange);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateSize = () => {
        const rect = container.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      };

      updateSize();
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(container);

      return () => resizeObserver.disconnect();
    }, []);

    const iphoneAspectRatio = 3278 / 1508;
    const pixelAspectRatio = 1301 / 600;
    const maxDeviceHeight = canvasHeight * 0.7;
    const maxDeviceWidth = canvasWidth * 0.4;
    const widthFromHeight = maxDeviceHeight / iphoneAspectRatio;
    const baseDeviceScale = Math.min(widthFromHeight, maxDeviceWidth);

    // Pixel scale calculation
    const pixelWidthFromHeight = maxDeviceHeight / pixelAspectRatio;
    const pixelDeviceScale = Math.min(pixelWidthFromHeight, maxDeviceWidth);

    const renderDevice = () => {
      switch (deviceType) {
        case 'iphone':
          return (
            <IPhoneFrame
              image={image}
              model={iphoneModel}
              color={iphoneColor}
              shadowIntensity={shadowIntensity}
              scale={baseDeviceScale}
              onImageSelect={onImageChange}
            />
          );
        case 'pixel':
          return (
            <PixelFrame
              image={image}
              model={pixelModel}
              color={pixelColor}
              shadowIntensity={shadowIntensity}
              scale={pixelDeviceScale}
              onImageSelect={onImageChange}
            />
          );
        case 'browser':
          return (
            <BrowserFrame
              image={image}
              borderRadius={12}
              shadowIntensity={shadowIntensity}
              onImageSelect={onImageChange}
            />
          );
        case 'none':
          return (
            <NoneFrame
              image={image}
              shadowIntensity={shadowIntensity}
              onImageSelect={onImageChange}
            />
          );
        default:
          return null;
      }
    };

    const previewScale = containerSize
      ? Math.min(
          (containerSize.width * 0.9) / canvasWidth,
          (containerSize.height * 0.9) / canvasHeight,
          1
        )
      : 0;

    return (
      <div
        className="flex-1 flex items-center justify-center p-6 overflow-hidden"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
          }}
          {...dragProps}
        >
          {/* Canvas Preview Area */}
          <div
            className="relative shrink-0 rounded-lg"
            style={{
              width: canvasWidth,
              height: canvasHeight,
              aspectRatio: `${canvasWidth} / ${canvasHeight}`,
              // Checkerboard pattern for transparent preview (not exported)
              background: background === 'transparent'
                ? 'repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 50% / 20px 20px'
                : 'transparent',
              transform: `scale(${previewScale * (zoom / 100)})`,
              transformOrigin: 'center center',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Actual canvas content (this gets exported) */}
            <div
              ref={ref}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: background === 'transparent' ? 'transparent' : background,
              }}
            >
            <AnimatePresence mode="wait">
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  transform: `scale(${mockupScale / 100})`,
                }}
              >
                {renderDevice()}
              </motion.div>
            </AnimatePresence>
            </div>
          </div>

          {/* Drag Overlay */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl"
                style={{
                  background: 'var(--active-bg)',
                  border: '2px dashed var(--text-primary)',
                }}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-primary)' }} />
                  </motion.div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Drop your image here</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);
