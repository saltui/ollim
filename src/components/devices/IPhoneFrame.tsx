'use client';

import { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import { IPHONE_MODELS, IPHONE_COLORS } from '@/lib/constants';
import type { IPhoneModel, IPhoneColor } from '@/lib/types';

interface IPhoneFrameProps {
  image: string | null;
  model: IPhoneModel;
  color: IPhoneColor;
  shadowIntensity: number;
  scale: number;
  onImageSelect: (image: string) => void;
}

export function IPhoneFrame({ image, model, color, shadowIntensity, scale, onImageSelect }: IPhoneFrameProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelConfig = IPHONE_MODELS.find(m => m.id === model) || IPHONE_MODELS[0];
  const colorConfig = IPHONE_COLORS.find(c => c.id === color) || IPHONE_COLORS[0];
  const isDisplayMode = colorConfig.is3D;

  const shadowOpacity = shadowIntensity / 100;
  const shadowBlur = 20 + (shadowIntensity * 0.8);
  const shadowSpread = shadowIntensity * 0.3;

  // Frame display size based on scale prop (actual image ratio: 1508x3278)
  const frameWidth = scale;
  const frameHeight = Math.round(frameWidth * (3278 / 1508));

  // Screen area position/size (percentage of frame, from image analysis)
  // Frame: 1508x3278, Screen: x=151, y=328, w=1205, h=2621
  const screenLeft = (151 / 1508) * 100;      // ~10.01%
  const screenTop = (328 / 3278) * 100;       // ~10.01%
  const screenWidth = (1205 / 1508) * 100;    // ~79.91%
  const screenHeight = (2621 / 3278) * 100;   // ~79.96%

  // For display mode: show only screen area without frame
  const displayWidth = (screenWidth / 100) * frameWidth;
  const displayHeight = (screenHeight / 100) * frameHeight;

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

  // Border radius calculation (based on original screen: 1205x2621 with ~180px radius)
  const screenBorderRadius = (180 / 1205) * displayWidth;

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
      {/* Screenshot layer */}
      <div
        className="absolute cursor-pointer group overflow-hidden"
        style={isDisplayMode ? {
          inset: 0,
          borderRadius: `${screenBorderRadius}px`,
        } : {
          left: `${screenLeft}%`,
          top: `${screenTop}%`,
          width: `${screenWidth}%`,
          height: `${screenHeight}%`,
          borderRadius: `${screenBorderRadius}px`,
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
