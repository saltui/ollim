'use client';

import { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import { PIXEL_MODELS, PIXEL_COLORS } from '@/lib/constants';
import type { PixelModel, PixelColor } from '@/lib/types';

interface PixelFrameProps {
  image: string | null;
  model: PixelModel;
  color: PixelColor;
  shadowIntensity: number;
  scale: number;
  onImageSelect: (image: string) => void;
}

export function PixelFrame({ image, model, color, shadowIntensity, scale, onImageSelect }: PixelFrameProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelConfig = PIXEL_MODELS.find(m => m.id === model) || PIXEL_MODELS[0];
  const colorConfig = PIXEL_COLORS.find(c => c.id === color) || PIXEL_COLORS[0];
  const isDisplayMode = colorConfig.is3D;

  const shadowOpacity = shadowIntensity / 100;
  const shadowBlur = 20 + (shadowIntensity * 0.8);
  const shadowSpread = shadowIntensity * 0.3;

  // Frame display size based on scale prop (actual image ratio: 600x1301)
  const frameWidth = scale;
  const frameHeight = Math.round(frameWidth * (1301 / 600));

  // Screen area from PNG analysis: x=60, y=130, w=480, h=1042
  // For display mode: show only screen area (480x1042 ratio)
  const displayWidth = (480 / 600) * frameWidth;
  const displayHeight = (1042 / 600) * frameWidth;

  // Border radius for display mode (38px at 600px width)
  const screenBorderRadius = (38 / 600) * frameWidth;

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

  const handleScreenClick = () => {
    fileInputRef.current?.click();
  };

  // Container dimensions change based on mode
  const containerWidth = isDisplayMode ? displayWidth : frameWidth;
  const containerHeight = isDisplayMode ? displayHeight : frameHeight;

  return (
    <div
      className="relative"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        filter: `drop-shadow(0 ${shadowSpread}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`,
      }}
    >
      {/* Screenshot layer with SVG mask */}
      <div
        className="absolute cursor-pointer group"
        style={isDisplayMode ? {
          inset: 0,
          borderRadius: `${screenBorderRadius}px`,
          overflow: 'hidden',
        } : {
          inset: 0,
          maskImage: 'url(/frames/pixel-7-pro/display.svg)',
          WebkitMaskImage: 'url(/frames/pixel-7-pro/display.svg)',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
        onClick={handleScreenClick}
      >
        {image ? (
          <img
            src={image}
            alt="Screenshot"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black transition-colors group-hover:bg-zinc-900">
            <ImagePlus className="w-6 h-6 text-zinc-600 mb-2 group-hover:text-zinc-500 transition-colors" />
            <p className="text-zinc-500 text-xs font-medium group-hover:text-zinc-400 transition-colors">
              Select Media
            </p>
            <p className="text-zinc-600 text-[10px] mt-0.5 group-hover:text-zinc-500 transition-colors">
              Click to upload
            </p>
          </div>
        )}

        {/* Hover Overlay for existing image */}
        {image && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-center">
              <ImagePlus className="w-5 h-5 text-white mb-1 mx-auto" />
              <p className="text-white text-[10px] font-medium">Change</p>
            </div>
          </div>
        )}
      </div>

      {/* Frame image overlay - hidden in display mode */}
      {!isDisplayMode && (
        <img
          src={colorConfig.frameImage}
          alt={`${modelConfig.name} ${colorConfig.name}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          draggable={false}
        />
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
