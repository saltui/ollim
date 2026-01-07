export type DeviceType = 'iphone' | 'pixel' | 'browser' | 'none';

export type BackgroundType = 'gradient' | 'solid' | 'transparent';

export type IPhoneModel = 'iphone-17';

export type IPhoneColor = 'black' | 'white' | 'lavender' | 'sage' | 'mist-blue' | 'display';

export type PixelModel = 'pixel-7-pro';

export type PixelColor = 'hazel' | 'obsidian' | 'snow' | 'display';

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
}
