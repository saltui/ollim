'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus } from 'lucide-react';

interface BrowserFrameProps {
  image: string | null;
  borderRadius: number;
  shadowIntensity: number;
  onImageSelect: (image: string) => void;
}

export function BrowserFrame({ image, borderRadius, shadowIntensity, onImageSelect }: BrowserFrameProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shadowOpacity = shadowIntensity / 100;
  const shadowBlur = 20 + (shadowIntensity * 0.8);
  const shadowSpread = shadowIntensity * 0.3;

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative"
      style={{
        filter: `drop-shadow(0 ${shadowSpread}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`,
      }}
    >
      {/* Browser Frame */}
      <div
        className="bg-zinc-800 overflow-hidden border border-zinc-700"
        style={{
          borderRadius: `${borderRadius}px`,
          width: '640px',
          minHeight: '420px',
        }}
      >
        {/* Title Bar */}
        <div className="flex items-center h-[44px] px-4 bg-gradient-to-b from-zinc-700 to-zinc-800 border-b border-zinc-700">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-[12px] h-[12px] rounded-full bg-[#ff5f57] border border-[#e0443e]" />
            <div className="w-[12px] h-[12px] rounded-full bg-[#febc2e] border border-[#dea123]" />
            <div className="w-[12px] h-[12px] rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          {/* URL Bar */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 rounded-md text-zinc-400 text-sm min-w-[300px] border border-zinc-700">
              <svg
                className="w-3.5 h-3.5 text-zinc-500"
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
              <span className="text-zinc-500">yourapp.com</span>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="w-[68px]" />
        </div>

        {/* Content Area */}
        <div
          className="relative bg-zinc-950 overflow-hidden cursor-pointer group"
          style={{
            minHeight: '376px',
          }}
          onClick={handleContentClick}
        >
          {image ? (
            <>
              <img
                src={image}
                alt="Screenshot"
                className="w-full h-auto"
                draggable={false}
              />
              {/* Hover Overlay for existing image */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center">
                  <ImagePlus className="w-6 h-6 text-white mb-2 mx-auto" />
                  <p className="text-white text-xs font-medium">Change Image</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-[376px] flex flex-col items-center justify-center transition-colors group-hover:bg-zinc-900">
              <ImagePlus className="w-8 h-8 text-zinc-600 mb-3 group-hover:text-zinc-500 transition-colors" />
              <p className="text-zinc-500 text-sm font-medium group-hover:text-zinc-400 transition-colors">
                Select Media
              </p>
              <p className="text-zinc-600 text-xs mt-1 group-hover:text-zinc-500 transition-colors">
                Open Media Picker
              </p>
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
