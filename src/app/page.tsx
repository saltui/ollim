'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { toPng, toBlob, toJpeg } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { generateExportFilename } from '@/lib/security';
import { smartResizeForDevice } from '@/lib/imageUtils';
import type { ExportOptions } from '@/lib/types';
import { Header } from '@/components/Header';
import { Canvas } from '@/components/Canvas';
import { LeftSidebar, RightSidebar } from '@/components/Sidebar';
import { ExportModal } from '@/components/ExportModal';
import { usePaste } from '@/hooks/usePaste';
import { DEFAULT_STATE } from '@/lib/constants';
import type { DeviceType, BackgroundType, IPhoneModel, IPhoneColor, PixelModel, PixelColor, BrowserType, BrowserTheme, BrowserAspectRatio } from '@/lib/types';

export default function Home() {
  const [image, setImage] = useState<string | null>(DEFAULT_STATE.image);
  const [originalImage, setOriginalImage] = useState<string | null>(null); // Store original for re-processing
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
  const [browserType, setBrowserType] = useState<BrowserType>(DEFAULT_STATE.browserType);
  const [browserTheme, setBrowserTheme] = useState<BrowserTheme>(DEFAULT_STATE.browserTheme);
  const [browserAddressUrl, setBrowserAddressUrl] = useState(DEFAULT_STATE.browserAddressUrl);
  const [browserWindowScale, setBrowserWindowScale] = useState(DEFAULT_STATE.browserWindowScale);
  const [browserAspectRatio, setBrowserAspectRatio] = useState<BrowserAspectRatio>(DEFAULT_STATE.browserAspectRatio);
  const [mockupScale, setMockupScale] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Process image for current device type
  const processImageForDevice = useCallback(async (imageData: string, device: DeviceType) => {
    try {
      const processed = await smartResizeForDevice(imageData, device);
      setImage(processed);
    } catch (error) {
      console.error('Failed to process image:', error);
      setImage(imageData); // Fallback to original
    }
  }, []);

  const handleImageChange = useCallback((newImage: string) => {
    setOriginalImage(newImage); // Store original
    processImageForDevice(newImage, deviceType);
  }, [deviceType, processImageForDevice]);

  // Re-process image when device type changes
  useEffect(() => {
    if (originalImage) {
      processImageForDevice(originalImage, deviceType);
    }
  }, [deviceType, originalImage, processImageForDevice]);

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

  const handleExport = async (options: ExportOptions) => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    try {
      // Reset transform to 1:1 scale for accurate export
      const originalTransform = canvasRef.current.style.transform;
      canvasRef.current.style.transform = 'scale(1)';

      let dataUrl: string;
      let filename: string;

      if (options.format === 'jpeg') {
        // JPEG export with quality option
        dataUrl = await toJpeg(canvasRef.current, {
          width: canvasWidth,
          height: canvasHeight,
          pixelRatio: 2,
          quality: options.quality / 100, // html-to-image uses 0-1 range
          backgroundColor: '#ffffff', // JPEG doesn't support transparency
        });
        filename = generateExportFilename('ollim').replace('.png', '.jpg');
      } else {
        // PNG export (lossless)
        dataUrl = await toPng(canvasRef.current, {
          width: canvasWidth,
          height: canvasHeight,
          pixelRatio: 2,
        });
        filename = generateExportFilename('ollim');
      }

      // Restore preview transform
      canvasRef.current.style.transform = originalTransform;

      // Download with sanitized filename
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Close modal after successful export
      setIsExportModalOpen(false);
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
          browserType={browserType}
          browserTheme={browserTheme}
          onDeviceChange={setDeviceType}
          onBackgroundTypeChange={setBackgroundType}
          onBackgroundValueChange={setBackgroundValue}
          onShadowIntensityChange={setShadowIntensity}
          onIphoneModelChange={setIphoneModel}
          onIphoneColorChange={setIphoneColor}
          onPixelModelChange={setPixelModel}
          onPixelColorChange={setPixelColor}
          onBrowserTypeChange={setBrowserType}
          onBrowserThemeChange={setBrowserTheme}
          browserAddressUrl={browserAddressUrl}
          browserWindowScale={browserWindowScale}
          browserAspectRatio={browserAspectRatio}
          onBrowserAddressUrlChange={setBrowserAddressUrl}
          onBrowserWindowScaleChange={setBrowserWindowScale}
          onBrowserAspectRatioChange={setBrowserAspectRatio}
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
          browserType={browserType}
          browserTheme={browserTheme}
          browserAddressUrl={browserAddressUrl}
          browserWindowScale={browserWindowScale}
          browserAspectRatio={browserAspectRatio}
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
          onExportClick={() => setIsExportModalOpen(true)}
          isExporting={isExporting}
        />
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        isExporting={isExporting}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
      />

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
