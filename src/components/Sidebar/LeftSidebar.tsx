'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, Square, Check, Droplets, Palette, Grid3X3, ChevronUp } from 'lucide-react';
import { GRADIENT_PRESETS, SOLID_COLORS, IPHONE_MODELS, IPHONE_COLORS, PIXEL_MODELS, PIXEL_COLORS } from '@/lib/constants';
import type { DeviceType, BackgroundType, IPhoneModel, IPhoneColor, PixelModel, PixelColor } from '@/lib/types';

interface LeftSidebarProps {
  deviceType: DeviceType;
  backgroundType: BackgroundType;
  backgroundValue: string;
  shadowIntensity: number;
  iphoneModel: IPhoneModel;
  iphoneColor: IPhoneColor;
  pixelModel: PixelModel;
  pixelColor: PixelColor;
  isModelPickerOpen: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onBackgroundTypeChange: (type: BackgroundType) => void;
  onBackgroundValueChange: (value: string) => void;
  onShadowIntensityChange: (value: number) => void;
  onIphoneModelChange: (model: IPhoneModel) => void;
  onIphoneColorChange: (color: IPhoneColor) => void;
  onPixelModelChange: (model: PixelModel) => void;
  onPixelColorChange: (color: PixelColor) => void;
  onModelPickerOpenChange: (open: boolean) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
      {children}
    </h3>
  );
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all"
      style={{
        background: active ? 'var(--active-bg)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}
    >
      {children}
    </button>
  );
}

export function LeftSidebar({
  deviceType,
  backgroundType,
  backgroundValue,
  shadowIntensity,
  iphoneColor,
  pixelColor,
  isModelPickerOpen,
  onDeviceChange,
  onBackgroundTypeChange,
  onBackgroundValueChange,
  onShadowIntensityChange,
  onIphoneColorChange,
  onPixelColorChange,
  onModelPickerOpenChange,
}: LeftSidebarProps) {

  // Determine current device category
  const getDeviceCategory = (): 'phone' | 'browser' | 'none' => {
    if (deviceType === 'iphone' || deviceType === 'pixel') return 'phone';
    if (deviceType === 'browser') return 'browser';
    return 'none';
  };

  const deviceCategory = getDeviceCategory();

  const deviceCategories: { type: 'phone' | 'browser' | 'none'; icon: React.ReactNode; label: string }[] = [
    { type: 'phone', icon: <Smartphone className="w-4 h-4" />, label: 'Phone' },
    { type: 'browser', icon: <Monitor className="w-4 h-4" />, label: 'Browser' },
    { type: 'none', icon: <Square className="w-4 h-4" />, label: 'None' },
  ];

  const backgroundTypes: { type: BackgroundType; icon: React.ReactNode; label: string }[] = [
    { type: 'gradient', icon: <Droplets className="w-4 h-4" />, label: 'Gradient' },
    { type: 'solid', icon: <Palette className="w-4 h-4" />, label: 'Solid' },
    { type: 'transparent', icon: <Grid3X3 className="w-4 h-4" />, label: 'None' },
  ];

  const currentIphoneModel = IPHONE_MODELS[0];
  const currentPixelModel = PIXEL_MODELS[0];

  // Get current phone model info
  const getCurrentPhoneInfo = () => {
    if (deviceType === 'iphone') {
      return { name: currentIphoneModel.name, resolution: currentIphoneModel.screenResolution, thumb: currentIphoneModel.thumbImage };
    } else if (deviceType === 'pixel') {
      return { name: currentPixelModel.name, resolution: currentPixelModel.screenResolution, thumb: currentPixelModel.thumbImage };
    }
    return { name: currentIphoneModel.name, resolution: currentIphoneModel.screenResolution, thumb: currentIphoneModel.thumbImage };
  };

  const currentPhone = getCurrentPhoneInfo();

  const handleCategoryChange = (category: 'phone' | 'browser' | 'none') => {
    if (category === 'phone') {
      if (deviceType !== 'iphone' && deviceType !== 'pixel') {
        onDeviceChange('iphone');
      }
    } else if (category === 'browser') {
      onDeviceChange('browser');
    } else {
      onDeviceChange('none');
    }
  };

  return (
    <aside
      className="w-[260px] flex flex-col overflow-hidden border-r"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Device Category Selection */}
        <section>
          <SectionTitle>Device</SectionTitle>
          <div
            className="grid grid-cols-3 rounded-lg p-1"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            {deviceCategories.map(({ type, icon, label }) => (
              <OptionButton
                key={type}
                active={deviceCategory === type}
                onClick={() => handleCategoryChange(type)}
              >
                {icon}
                <span className="text-[11px] font-medium">{label}</span>
              </OptionButton>
            ))}
          </div>
        </section>

        {/* Phone Model Selection - only when phone category is selected */}
        <AnimatePresence>
          {deviceCategory === 'phone' && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SectionTitle>Model</SectionTitle>
              <div className="relative">
                <button
                  onClick={() => onModelPickerOpenChange(!isModelPickerOpen)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <img
                    src={currentPhone.thumb}
                    alt={currentPhone.name}
                    className="w-8 h-8 object-contain"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {currentPhone.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {currentPhone.resolution}
                  </p>
                </div>
                <ChevronUp
                    className="w-4 h-4 transition-transform"
                    style={{
                      color: 'var(--text-tertiary)',
                      transform: isModelPickerOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                  />
                </button>

                {/* Model Picker Popup */}
                <AnimatePresence>
                  {isModelPickerOpen && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100]"
                        onClick={() => onModelPickerOpenChange(false)}
                      />
                      {/* Popup */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-[101] p-4 rounded-2xl shadow-2xl"
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          width: '400px',
                          left: '16px',
                          top: '180px',
                        }}
                      >
                        {/* Grid of device cards */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* iPhone Card */}
                          <button
                            onClick={() => {
                              onDeviceChange('iphone');
                              onModelPickerOpenChange(false);
                            }}
                            className="p-3 rounded-xl transition-all text-left"
                            style={{
                              background: 'var(--bg-tertiary)',
                              border: `2px solid ${deviceType === 'iphone' ? 'var(--text-primary)' : 'transparent'}`,
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {currentIphoneModel.name}
                                </p>
                                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                  {currentIphoneModel.screenResolution}
                                </p>
                              </div>
                              <span
                                className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                              >
                                New
                              </span>
                            </div>
                            <div className="flex justify-center py-4">
                              <img
                                src={currentIphoneModel.thumbImage}
                                alt={currentIphoneModel.name}
                                className="h-28 object-contain"
                              />
                            </div>
                            {/* Color Options Preview */}
                            <div className="flex gap-1.5 mt-2">
                              {IPHONE_COLORS.slice(0, 3).map((color) => (
                                <div
                                  key={color.id}
                                  className="w-7 h-7 rounded-lg overflow-hidden"
                                  style={{ background: 'var(--bg-elevated)' }}
                                >
                                  <img
                                    src={color.thumbImage}
                                    alt={color.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ))}
                              {IPHONE_COLORS.length > 3 && (
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-medium"
                                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}
                                >
                                  +{IPHONE_COLORS.length - 3}
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Pixel Card */}
                          <button
                            onClick={() => {
                              onDeviceChange('pixel');
                              onModelPickerOpenChange(false);
                            }}
                            className="p-3 rounded-xl transition-all text-left"
                            style={{
                              background: 'var(--bg-tertiary)',
                              border: `2px solid ${deviceType === 'pixel' ? 'var(--text-primary)' : 'transparent'}`,
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {currentPixelModel.name}
                                </p>
                                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                  {currentPixelModel.screenResolution}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-center py-4">
                              <img
                                src={currentPixelModel.thumbImage}
                                alt={currentPixelModel.name}
                                className="h-28 object-contain"
                              />
                            </div>
                            {/* Color Options Preview */}
                            <div className="flex gap-1.5 mt-2">
                              {PIXEL_COLORS.slice(0, 3).map((color) => (
                                <div
                                  key={color.id}
                                  className="w-7 h-7 rounded-lg overflow-hidden"
                                  style={{ background: 'var(--bg-elevated)' }}
                                >
                                  <img
                                    src={color.thumbImage}
                                    alt={color.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ))}
                              {PIXEL_COLORS.length > 3 && (
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-medium"
                                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}
                                >
                                  +{PIXEL_COLORS.length - 3}
                                </div>
                              )}
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* iPhone Style Selection */}
        {deviceType === 'iphone' && (
          <section>
            <SectionTitle>Style</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {IPHONE_COLORS.map((colorOption) => (
                <button
                  key={colorOption.id}
                  onClick={() => onIphoneColorChange(colorOption.id)}
                  className="relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
                  style={{
                    background: iphoneColor === colorOption.id ? 'var(--active-bg)' : 'var(--bg-tertiary)',
                    border: `1px solid ${iphoneColor === colorOption.id ? 'var(--border-strong)' : 'transparent'}`,
                  }}
                >
                  <div className="relative w-full aspect-square flex items-center justify-center">
                    <img
                      src={colorOption.thumbImage}
                      alt={colorOption.name}
                      className="w-12 h-12 object-contain"
                    />
                    {colorOption.is3D && (
                      <span
                        className="absolute bottom-0 right-0 text-[9px] font-medium px-1 py-0.5 rounded"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}
                      >
                        3D
                      </span>
                    )}
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {colorOption.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Pixel Style Selection */}
        {deviceType === 'pixel' && (
          <section>
            <SectionTitle>Style</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {PIXEL_COLORS.map((colorOption) => (
                <button
                  key={colorOption.id}
                  onClick={() => onPixelColorChange(colorOption.id)}
                  className="relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
                  style={{
                    background: pixelColor === colorOption.id ? 'var(--active-bg)' : 'var(--bg-tertiary)',
                    border: `1px solid ${pixelColor === colorOption.id ? 'var(--border-strong)' : 'transparent'}`,
                  }}
                >
                  <div className="relative w-full aspect-square flex items-center justify-center">
                    <img
                      src={colorOption.thumbImage}
                      alt={colorOption.name}
                      className="w-12 h-12 object-contain"
                    />
                    {colorOption.is3D && (
                      <span
                        className="absolute bottom-0 right-0 text-[9px] font-medium px-1 py-0.5 rounded"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}
                      >
                        3D
                      </span>
                    )}
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {colorOption.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Shadow */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Shadow</SectionTitle>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {shadowIntensity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={shadowIntensity}
            onChange={(e) => onShadowIntensityChange(Number(e.target.value))}
            className="w-full"
          />
        </section>

        {/* Background */}
        <section>
          <SectionTitle>Background</SectionTitle>
          <div
            className="grid grid-cols-3 rounded-lg p-1 mb-4"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            {backgroundTypes.map(({ type, icon, label }) => (
              <OptionButton
                key={type}
                active={backgroundType === type}
                onClick={() => {
                  onBackgroundTypeChange(type);
                  if (type === 'transparent') {
                    onBackgroundValueChange('transparent');
                  } else if (type === 'gradient') {
                    onBackgroundValueChange(GRADIENT_PRESETS[0].style);
                  } else {
                    onBackgroundValueChange(SOLID_COLORS[0]);
                  }
                }}
              >
                {icon}
                <span className="text-[11px] font-medium">{label}</span>
              </OptionButton>
            ))}
          </div>

          {/* Gradient Presets */}
          <AnimatePresence>
            {backgroundType === 'gradient' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-4 gap-2"
              >
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onBackgroundValueChange(preset.style)}
                    className="relative w-full aspect-square rounded-lg overflow-hidden transition-transform hover:scale-95"
                    style={{
                      background: preset.style,
                      boxShadow: backgroundValue === preset.style ? '0 0 0 2px var(--text-primary)' : 'none',
                    }}
                    title={preset.name}
                  >
                    {backgroundValue === preset.style && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solid Colors */}
          <AnimatePresence>
            {backgroundType === 'solid' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-6 gap-1.5"
              >
                {SOLID_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onBackgroundValueChange(color)}
                    className="relative w-full aspect-square rounded-md overflow-hidden transition-transform hover:scale-90"
                    style={{
                      backgroundColor: color,
                      boxShadow: backgroundValue === color ? '0 0 0 2px var(--text-primary)' : 'none',
                    }}
                    title={color}
                  >
                    {backgroundValue === color && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </aside>
  );
}
