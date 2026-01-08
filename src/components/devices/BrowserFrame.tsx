'use client';

import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus } from 'lucide-react';
import type { BrowserType, BrowserTheme } from '@/lib/types';

interface BrowserFrameProps {
  image: string | null;
  browserType: BrowserType;
  browserTheme: BrowserTheme;
  addressUrl: string;
  windowScale: number; // 50-150 percentage scale for entire window
  windowAspectRatio: 'auto' | '16:9' | '4:3' | '1:1';
  onImageSelect: (image: string) => void;
}

// Safari styling
const safariStyles = {
  light: {
    frame: '#f6f6f6',
    titleBar: 'linear-gradient(180deg, #e8e8e8 0%, #d4d4d4 100%)',
    border: '#c5c5c5',
    urlBar: '#ffffff',
    urlBarBorder: '#c5c5c5',
    urlText: '#333333',
    content: '#ffffff',
  },
  dark: {
    frame: '#323232',
    titleBar: 'linear-gradient(180deg, #3d3d3d 0%, #323232 100%)',
    border: '#1a1a1a',
    urlBar: '#1e1e1e',
    urlBarBorder: '#4a4a4a',
    urlText: '#9ca3af',
    content: '#1e1e1e',
  },
};

// Chrome styling
const chromeStyles = {
  light: {
    frame: '#dee1e6',
    titleBar: '#dee1e6',
    tabBar: '#f1f3f4',
    activeTab: '#ffffff',
    border: '#c4c7cc',
    urlBar: '#f1f3f4',
    urlBarBorder: '#dfe1e5',
    urlText: '#5f6368',
    content: '#ffffff',
  },
  dark: {
    frame: '#202124',
    titleBar: '#202124',
    tabBar: '#292a2d',
    activeTab: '#35363a',
    border: '#3c4043',
    urlBar: '#35363a',
    urlBarBorder: '#5f6368',
    urlText: '#9aa0a6',
    content: '#202124',
  },
};

function TrafficLights({ theme }: { theme: BrowserTheme }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: '#ff5f57',
          boxShadow: theme === 'light' ? 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' : 'none'
        }}
      />
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: '#febc2e',
          boxShadow: theme === 'light' ? 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' : 'none'
        }}
      />
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: '#28c840',
          boxShadow: theme === 'light' ? 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' : 'none'
        }}
      />
    </div>
  );
}

function SafariTitleBar({ theme, addressUrl }: { theme: BrowserTheme; addressUrl: string }) {
  const styles = safariStyles[theme];

  return (
    <div
      className="flex items-center h-11 px-4"
      style={{
        background: styles.titleBar,
        borderBottom: `1px solid ${styles.border}`,
      }}
    >
      <TrafficLights theme={theme} />

      {/* URL Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm w-full max-w-[400px]"
          style={{
            background: styles.urlBar,
            border: `1px solid ${styles.urlBarBorder}`,
          }}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: styles.urlText }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span
            className="truncate text-center flex-1"
            style={{ color: styles.urlText }}
          >
            {addressUrl || 'yourapp.com'}
          </span>
        </div>
      </div>

      <div className="w-[68px]" />
    </div>
  );
}

function ChromeTitleBar({ theme, addressUrl }: { theme: BrowserTheme; addressUrl: string }) {
  const styles = chromeStyles[theme];

  return (
    <>
      {/* Tab Bar */}
      <div
        className="flex items-end h-9 px-2 pt-2"
        style={{ background: styles.tabBar }}
      >
        <TrafficLights theme={theme} />
        {/* Active Tab */}
        <div
          className="ml-4 px-4 py-1.5 rounded-t-lg text-xs font-medium"
          style={{
            background: styles.activeTab,
            color: styles.urlText,
          }}
        >
          New Tab
        </div>
      </div>

      {/* URL Bar */}
      <div
        className="flex items-center h-10 px-4 gap-3"
        style={{
          background: styles.activeTab,
          borderBottom: `1px solid ${styles.border}`,
        }}
      >
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: styles.urlText }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <svg className="w-4 h-4" style={{ color: styles.urlText }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <svg className="w-4 h-4" style={{ color: styles.urlText }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        {/* URL Bar */}
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
          style={{
            background: styles.urlBar,
          }}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: styles.urlText }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span
            className="truncate"
            style={{ color: styles.urlText }}
          >
            {addressUrl || 'yourapp.com'}
          </span>
        </div>

        {/* Menu dots */}
        <svg className="w-4 h-4" style={{ color: styles.urlText }} fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      </div>
    </>
  );
}

export function BrowserFrame({
  image,
  browserType = 'safari',
  browserTheme = 'light',
  addressUrl = '',
  windowScale = 100,
  windowAspectRatio = 'auto',
  onImageSelect,
}: BrowserFrameProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = browserType === 'safari' ? safariStyles[browserTheme] : chromeStyles[browserTheme];
  const scale = windowScale / 100; // Convert percentage to scale factor
  const baseWidth = 800; // Base window width

  // Calculate content dimensions based on aspect ratio
  const contentDimensions = useMemo(() => {
    const ratioMap = {
      '16:9': 9 / 16,
      '4:3': 3 / 4,
      '1:1': 1,
    };

    // If auto with image, let image determine height
    if (windowAspectRatio === 'auto') {
      if (image) {
        return { width: baseWidth, height: 'auto' as const };
      }
      // No image, use 16:9 as default
      return { width: baseWidth, height: Math.round(baseWidth * (9 / 16)) };
    }

    // Fixed aspect ratio - apply even with image
    const ratio = ratioMap[windowAspectRatio];
    return {
      width: baseWidth,
      height: Math.round(baseWidth * ratio),
    };
  }, [windowAspectRatio, image]);

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

  const handleContentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: scale * 0.95 }}
      animate={{ opacity: 1, scale: scale }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative"
      style={{
        transformOrigin: 'center center',
      }}
    >
      {/* Browser Frame */}
      <div
        className="overflow-hidden"
        style={{
          background: styles.frame,
          borderRadius: '12px',
          width: baseWidth,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Title Bar */}
        {browserType === 'safari' ? (
          <SafariTitleBar theme={browserTheme} addressUrl={addressUrl} />
        ) : (
          <ChromeTitleBar theme={browserTheme} addressUrl={addressUrl} />
        )}

        {/* Content Area */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          style={{
            background: styles.content,
            height: contentDimensions.height === 'auto' ? 'auto' : contentDimensions.height,
            minHeight: contentDimensions.height === 'auto' ? 200 : undefined,
          }}
          onClick={handleContentClick}
        >
          {image ? (
            <>
              <img
                src={image}
                alt="Screenshot"
                className="w-full block"
                style={{
                  height: contentDimensions.height === 'auto' ? 'auto' : contentDimensions.height,
                  objectFit: contentDimensions.height === 'auto' ? undefined : 'cover',
                }}
                draggable={false}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center">
                  <ImagePlus className="w-6 h-6 text-white mb-2 mx-auto" />
                  <p className="text-white text-xs font-medium">Change Image</p>
                </div>
              </div>
            </>
          ) : (
            <div
              className="w-full flex flex-col items-center justify-center transition-colors"
              style={{
                height: contentDimensions.height === 'auto' ? 300 : contentDimensions.height,
                color: browserTheme === 'dark' ? '#6b7280' : '#9ca3af',
              }}
            >
              <ImagePlus className="w-8 h-8 mb-3 opacity-50" />
              <p className="text-sm font-medium opacity-70">Select Media</p>
              <p className="text-xs mt-1 opacity-50">Click or paste an image</p>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </motion.div>
  );
}
