'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Canvas } from '@/components/Canvas';
import { LeftSidebar, RightSidebar } from '@/components/Sidebar';
import { usePaste } from '@/hooks/usePaste';
import { DEFAULT_STATE } from '@/lib/constants';
import type { DeviceType, BackgroundType, IPhoneModel, IPhoneColor, PixelModel, PixelColor } from '@/lib/types';

export default function Home() {
  const [image, setImage] = useState<string | null>(DEFAULT_STATE.image);
  const [deviceType, setDeviceType] = useState<DeviceType>(DEFAULT_STATE.deviceType);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(DEFAULT_STATE.backgroundType);
  const [backgroundValue, setBackgroundValue] = useState(DEFAULT_STATE.backgroundValue);
  const [shadowIntensity, setShadowIntensity] = useState(DEFAULT_STATE.shadowIntensity);
  const [zoom, setZoom] = useState(DEFAULT_STATE.zoom);
  const [canvasWidth, setCanvasWidth] = useState(DEFAULT_STATE.canvasWidth);
  const [canvasHeight, setCanvasHeight] = useState(DEFAULT_STATE.canvasHeight);
  const [iphoneModel, setIphoneModel] = useState<IPhoneModel>(DEFAULT_STATE.iphoneModel);
  const [iphoneColor, setIphoneColor] = useState<IPhoneColor>(DEFAULT_STATE.iphoneColor);
  const [pixelModel, setPixelModel] = useState<PixelModel>(DEFAULT_STATE.pixelModel);
  const [pixelColor, setPixelColor] = useState<PixelColor>(DEFAULT_STATE.pixelColor);
  const [mockupScale, setMockupScale] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleImageChange = useCallback((newImage: string) => {
    setImage(newImage);
  }, []);

  usePaste(handleImageChange);

  const handleCopyToClipboard = useCallback(async () => {
    if (!canvasRef.current || isCopying) return;

    setIsCopying(true);
    try {
      const originalTransform = canvasRef.current.style.transform;
      canvasRef.current.style.transform = 'scale(1)';

      const blob = await toBlob(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        pixelRatio: 2,
      });

      canvasRef.current.style.transform = originalTransform;

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000);
      }
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
    } finally {
      setIsCopying(false);
    }
  }, [canvasWidth, canvasHeight, isCopying]);

  // Cmd+Shift+C keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopyToClipboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopyToClipboard]);

  const handleExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    try {
      // Reset transform to 1:1 scale for accurate export
      const originalTransform = canvasRef.current.style.transform;
      canvasRef.current.style.transform = 'scale(1)';

      const dataUrl = await toPng(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        pixelRatio: 2, // 2x resolution for high quality export
      });

      // Restore preview transform
      canvasRef.current.style.transform = originalTransform;

      // Download
      const link = document.createElement('a');
      link.download = `mockit-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCanvasSizeChange = (width: number, height: number) => {
    setCanvasWidth(width);
    setCanvasHeight(height);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden p-0">
        <LeftSidebar
          deviceType={deviceType}
          backgroundType={backgroundType}
          backgroundValue={backgroundValue}
          shadowIntensity={shadowIntensity}
          iphoneModel={iphoneModel}
          iphoneColor={iphoneColor}
          pixelModel={pixelModel}
          pixelColor={pixelColor}
          onDeviceChange={setDeviceType}
          onBackgroundTypeChange={setBackgroundType}
          onBackgroundValueChange={setBackgroundValue}
          onShadowIntensityChange={setShadowIntensity}
          onIphoneModelChange={setIphoneModel}
          onIphoneColorChange={setIphoneColor}
          onPixelModelChange={setPixelModel}
          onPixelColorChange={setPixelColor}
          isModelPickerOpen={isModelPickerOpen}
          onModelPickerOpenChange={setIsModelPickerOpen}
        />

        <Canvas
          ref={canvasRef}
          image={image}
          deviceType={deviceType}
          background={backgroundValue}
          shadowIntensity={shadowIntensity}
          zoom={zoom}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          iphoneModel={iphoneModel}
          iphoneColor={iphoneColor}
          pixelModel={pixelModel}
          pixelColor={pixelColor}
          mockupScale={mockupScale}
          onImageChange={handleImageChange}
        />

        <RightSidebar
          zoom={zoom}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          mockupScale={mockupScale}
          onZoomChange={setZoom}
          onCanvasSizeChange={handleCanvasSizeChange}
          onMockupScaleChange={setMockupScale}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>

      {/* Copy Toast */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg z-50"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Check className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Copied to clipboard
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
