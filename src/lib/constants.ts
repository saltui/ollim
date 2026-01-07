import { GradientPreset, IPhoneModelConfig, IPhoneColorConfig, PixelModelConfig, PixelColorConfig } from './types';

export const IPHONE_MODELS: IPhoneModelConfig[] = [
  {
    id: 'iphone-17',
    name: 'iPhone 17',
    // Screen positioning values (percentage-based)
    // Analyzed from frame image: screen fills transparent area inside frame bezel
    screenTop: 10.0,
    screenLeft: 6.5,
    screenWidth: 86.9,
    screenHeight: 80.0,
    screenBorderRadius: 8,
    year: 2025,
    thumbImage: '/devices/iphone-17.png',
    screenResolution: '1206 / 2622',
  },
];

export const IPHONE_COLORS: IPhoneColorConfig[] = [
  {
    id: 'black',
    name: 'Black',
    frameImage: '/frames/iphone-17/black.png',
    thumbImage: '/thumbs/iphone-17/black.png',
    previewColor: '#1c1c1e',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    frameImage: '/frames/iphone-17/lavender.png',
    thumbImage: '/thumbs/iphone-17/lavender.png',
    previewColor: '#c8b6e2',
  },
  {
    id: 'sage',
    name: 'Sage',
    frameImage: '/frames/iphone-17/sage.png',
    thumbImage: '/thumbs/iphone-17/sage.png',
    previewColor: '#b8c9b8',
  },
  {
    id: 'mist-blue',
    name: 'Mist Blue',
    frameImage: '/frames/iphone-17/mist-blue.png',
    thumbImage: '/thumbs/iphone-17/mist-blue.png',
    previewColor: '#a8c4d4',
  },
  {
    id: 'white',
    name: 'White',
    frameImage: '/frames/iphone-17/white.png',
    thumbImage: '/thumbs/iphone-17/white.png',
    previewColor: '#f5f5f7',
  },
  {
    id: 'display',
    name: 'Display',
    frameImage: '/frames/iphone-17/display.svg',
    thumbImage: '/thumbs/iphone-17/display.png',
    previewColor: '#3f3f46',
    is3D: true,
  },
];

export const PIXEL_MODELS: PixelModelConfig[] = [
  {
    id: 'pixel-7-pro',
    name: 'Pixel 7 Pro',
    // Screen positioning from image analysis (600x1301 frame)
    // Using shots.so reference ratio 720/1560
    screenTop: 5.3,
    screenLeft: 6.0,
    screenWidth: 88.0,
    screenHeight: 91.5,
    screenBorderRadius: 7,
    year: 2022,
    thumbImage: '/devices/pixel-7-pro.png',
    screenResolution: '1080 / 2340',
  },
];

export const PIXEL_COLORS: PixelColorConfig[] = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    frameImage: '/frames/pixel-7-pro/obsidian.png',
    thumbImage: '/thumbs/pixel-7-pro/obsidian.png',
    previewColor: '#1a1a1a',
  },
  {
    id: 'snow',
    name: 'Snow',
    frameImage: '/frames/pixel-7-pro/snow.png',
    thumbImage: '/thumbs/pixel-7-pro/snow.png',
    previewColor: '#f5f5f5',
  },
  {
    id: 'hazel',
    name: 'Hazel',
    frameImage: '/frames/pixel-7-pro/hazel.png',
    thumbImage: '/thumbs/pixel-7-pro/hazel.png',
    previewColor: '#c4b8a5',
  },
  {
    id: 'display',
    name: 'Display',
    frameImage: '/frames/pixel-7-pro/display.svg',
    thumbImage: '/thumbs/pixel-7-pro/display.png',
    previewColor: '#3f3f46',
    is3D: true,
  },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    colors: ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'],
    style: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: ['#667eea', '#764ba2', '#f093fb'],
    style: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#fa709a', '#fee140'],
    style: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#2193b0', '#6dd5ed'],
    style: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    colors: ['#4776E6', '#8E54E9'],
    style: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
  },
  {
    id: 'ember',
    name: 'Ember',
    colors: ['#f12711', '#f5af19'],
    style: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#134e5e', '#71b280'],
    style: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  },
  {
    id: 'candy',
    name: 'Candy',
    colors: ['#ff6a88', '#ff99ac', '#fcb69f'],
    style: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #fcb69f 100%)',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: ['#0f0c29', '#302b63', '#24243e'],
    style: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  },
  {
    id: 'mesh-purple',
    name: 'Mesh Purple',
    colors: ['#7f5af0', '#2cb67d', '#ff8906'],
    style: 'radial-gradient(at 40% 20%, #7f5af0 0px, transparent 50%), radial-gradient(at 80% 0%, #2cb67d 0px, transparent 50%), radial-gradient(at 0% 50%, #ff8906 0px, transparent 50%), radial-gradient(at 80% 50%, #7f5af0 0px, transparent 50%), radial-gradient(at 0% 100%, #2cb67d 0px, transparent 50%), radial-gradient(at 80% 100%, #ff8906 0px, transparent 50%), linear-gradient(#16161a, #16161a)',
  },
  {
    id: 'mesh-warm',
    name: 'Mesh Warm',
    colors: ['#ffc6c7', '#ffecd2', '#fcb69f'],
    style: 'radial-gradient(at 0% 0%, #ffc6c7 0px, transparent 50%), radial-gradient(at 100% 0%, #ffecd2 0px, transparent 50%), radial-gradient(at 100% 100%, #fcb69f 0px, transparent 50%), radial-gradient(at 0% 100%, #ffc6c7 0px, transparent 50%), linear-gradient(#ffecd2, #ffecd2)',
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: ['#00f5d4', '#00bbf9', '#9b5de5', '#f15bb5'],
    style: 'linear-gradient(135deg, #00f5d4 0%, #00bbf9 33%, #9b5de5 66%, #f15bb5 100%)',
  },
];

export const SOLID_COLORS = [
  '#09090b', // zinc-950
  '#18181b', // zinc-900
  '#27272a', // zinc-800
  '#3f3f46', // zinc-700
  '#ffffff', // white
  '#f4f4f5', // zinc-100
  '#7f5af0', // purple
  '#2cb67d', // green
  '#ff8906', // orange
  '#3b82f6', // blue
  '#ef4444', // red
  '#eab308', // yellow
];

export const CANVAS_SIZES = [
  { label: 'Twitter Post', width: 1200, height: 675 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'LinkedIn Post', width: 1200, height: 627 },
  { label: 'Dribbble', width: 1600, height: 1200 },
  { label: '4K', width: 3840, height: 2160 },
  { label: 'Custom', width: 1920, height: 1080 },
];

export const DEFAULT_STATE = {
  image: null,
  deviceType: 'iphone' as const,
  backgroundType: 'gradient' as const,
  backgroundValue: GRADIENT_PRESETS[0].style,
  shadowIntensity: 50,
  zoom: 100,
  canvasWidth: 1920,
  canvasHeight: 1080,
  iphoneModel: 'iphone-17' as const,
  iphoneColor: 'white' as const,
  pixelModel: 'pixel-7-pro' as const,
  pixelColor: 'obsidian' as const,
};
