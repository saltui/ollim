/**
 * Image processing utilities for smart resizing based on device aspect ratio
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface DeviceScreenInfo {
  aspectRatio: number; // height / width
  name: string;
}

// Device screen aspect ratios (height / width)
export const DEVICE_SCREEN_RATIOS: Record<string, DeviceScreenInfo> = {
  'iphone-17': { aspectRatio: 2622 / 1206, name: 'iPhone 17' },
  'pixel-7-pro': { aspectRatio: 2340 / 1080, name: 'Pixel 7 Pro' },
  'browser': { aspectRatio: 9 / 16, name: 'Browser' }, // Default landscape
};

/**
 * Get image dimensions from a data URL
 */
export function getImageDimensions(dataUrl: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Resize image to fit within target dimensions while maintaining aspect ratio
 * Uses canvas to perform the resize
 */
export function resizeImage(
  dataUrl: string,
  targetWidth: number,
  targetHeight: number,
  mode: 'fit' | 'cover' = 'cover'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const sourceWidth = img.naturalWidth;
      const sourceHeight = img.naturalHeight;
      const sourceAspect = sourceWidth / sourceHeight;
      const targetAspect = targetWidth / targetHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX = 0;
      let offsetY = 0;

      if (mode === 'cover') {
        // Cover: fill target completely, may crop
        if (sourceAspect > targetAspect) {
          // Source is wider - fit by height, crop width
          drawHeight = targetHeight;
          drawWidth = sourceWidth * (targetHeight / sourceHeight);
          offsetX = (targetWidth - drawWidth) / 2;
        } else {
          // Source is taller - fit by width, crop height
          drawWidth = targetWidth;
          drawHeight = sourceHeight * (targetWidth / sourceWidth);
          offsetY = (targetHeight - drawHeight) / 2;
        }
      } else {
        // Fit: show entire image, may have letterboxing
        if (sourceAspect > targetAspect) {
          drawWidth = targetWidth;
          drawHeight = targetWidth / sourceAspect;
          offsetY = (targetHeight - drawHeight) / 2;
        } else {
          drawHeight = targetHeight;
          drawWidth = targetHeight * sourceAspect;
          offsetX = (targetWidth - drawWidth) / 2;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw the image
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Smart resize image based on device type
 * Prioritizes width fitting and adjusts based on device aspect ratio
 */
export async function smartResizeForDevice(
  dataUrl: string,
  deviceType: 'iphone' | 'pixel' | 'browser' | 'none',
  deviceModel?: string
): Promise<string> {
  // For 'none' device type, return original image
  if (deviceType === 'none') {
    return dataUrl;
  }

  const dimensions = await getImageDimensions(dataUrl);
  const sourceAspect = dimensions.width / dimensions.height;

  // Get target aspect ratio based on device
  let targetAspect: number;
  if (deviceType === 'iphone') {
    targetAspect = 1206 / 2622; // iPhone 17 screen (width / height)
  } else if (deviceType === 'pixel') {
    targetAspect = 1080 / 2340; // Pixel 7 Pro screen (width / height)
  } else {
    // Browser - more flexible, use image's natural aspect
    return dataUrl;
  }

  // If source aspect is very different from target, resize
  const aspectDiff = Math.abs(sourceAspect - targetAspect) / targetAspect;

  // Only resize if aspect ratio difference is significant (> 20%)
  if (aspectDiff < 0.2) {
    return dataUrl;
  }

  // Calculate target dimensions
  // For phones, we want width-priority: fit the image width to screen width
  // Standard phone screen widths in pixels
  const baseWidth = deviceType === 'iphone' ? 1206 : 1080;
  const baseHeight = deviceType === 'iphone' ? 2622 : 2340;

  // If source is landscape and device is portrait, we need special handling
  const isSourceLandscape = sourceAspect > 1;
  const isTargetPortrait = targetAspect < 1;

  if (isSourceLandscape && isTargetPortrait) {
    // Landscape image on portrait device
    // Scale to fit width, let height overflow (will be cropped or scrolled)
    const targetWidth = baseWidth;
    const targetHeight = Math.round(targetWidth / sourceAspect);

    return resizeImage(dataUrl, targetWidth, targetHeight, 'fit');
  }

  // Default: resize to fit device screen dimensions
  return resizeImage(dataUrl, baseWidth, baseHeight, 'cover');
}

/**
 * Check if image needs resizing for better display
 * Returns true if image dimensions are significantly different from target device
 */
export async function shouldResizeImage(
  dataUrl: string,
  deviceType: 'iphone' | 'pixel' | 'browser' | 'none'
): Promise<boolean> {
  if (deviceType === 'none' || deviceType === 'browser') {
    return false;
  }

  const dimensions = await getImageDimensions(dataUrl);
  const sourceAspect = dimensions.width / dimensions.height;

  const targetAspect = deviceType === 'iphone'
    ? 1206 / 2622
    : 1080 / 2340;

  const aspectDiff = Math.abs(sourceAspect - targetAspect) / targetAspect;

  return aspectDiff > 0.2;
}
