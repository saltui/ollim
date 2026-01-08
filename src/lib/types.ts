export type DeviceType = 'iphone' | 'pixel' | 'browser' | 'none';

export type BackgroundType = 'gradient' | 'solid' | 'transparent';

export type ExportFormat = 'png' | 'jpeg';

export interface ExportOptions {
  format: ExportFormat;
  quality: number; // 1-100, only for JPEG
}

export type IPhoneModel = 'iphone-17';

export type IPhoneColor = 'black' | 'white' | 'lavender' | 'sage' | 'mist-blue' | 'display';

export type PixelModel = 'pixel-7-pro';

export type PixelColor = 'hazel' | 'obsidian' | 'snow' | 'display';

export type BrowserType = 'safari' | 'chrome';

export type BrowserTheme = 'light' | 'dark';

export type BrowserAspectRatio = 'auto' | '16:9' | '4:3' | '1:1';

export interface IPhoneModelConfig {
  id: IPhoneModel;
  name: string;
  // Screen area positioning (percentage-based for the image frame)
  screenTop: number;
  screenLeft: number;
  screenWidth: number;
  screenHeight: number;
  screenBorderRadius: number;
  year: number;
  thumbImage: string;
  screenResolution: string;
}

export interface IPhoneColorConfig {
  id: IPhoneColor;
  name: string;
  frameImage: string;
  thumbImage: string;
  previewColor: string;
  is3D?: boolean;
}

export interface PixelModelConfig {
  id: PixelModel;
  name: string;
  screenTop: number;
  screenLeft: number;
  screenWidth: number;
  screenHeight: number;
  screenBorderRadius: number;
  year: number;
  thumbImage: string;
  screenResolution: string;
}

export interface PixelColorConfig {
  id: PixelColor;
  name: string;
  frameImage: string;
  thumbImage: string;
  previewColor: string;
  is3D?: boolean;
}

export interface BrowserConfig {
  id: BrowserType;
  name: string;
  themes: {
    light: {
      frameImage: string;
      thumbImage: string;
      previewColor: string;
    };
    dark: {
      frameImage: string;
      thumbImage: string;
      previewColor: string;
    };
  };
  // Screen area positioning (percentage-based)
  screenTop: number;
  screenLeft: number;
  screenWidth: number;
  screenHeight: number;
  screenBorderRadius: number;
}

export interface GradientPreset {
  id: string;
  name: string;
  colors: string[];
  style: string;
}

export interface AppState {
  image: string | null;
  deviceType: DeviceType;
  backgroundType: BackgroundType;
  backgroundValue: string;
  shadowIntensity: number;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  iphoneModel: IPhoneModel;
  iphoneColor: IPhoneColor;
  pixelModel: PixelModel;
  pixelColor: PixelColor;
  browserType: BrowserType;
  browserTheme: BrowserTheme;
  browserAddressUrl: string;
  browserWindowScale: number;
  browserAspectRatio: BrowserAspectRatio;
}
