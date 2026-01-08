// Security utilities for image validation

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// PNG magic bytes
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// JPEG magic bytes (various forms)
const JPEG_SIGNATURES = [
  [0xff, 0xd8, 0xff, 0xe0],
  [0xff, 0xd8, 0xff, 0xe1],
  [0xff, 0xd8, 0xff, 0xe2],
  [0xff, 0xd8, 0xff, 0xe3],
  [0xff, 0xd8, 0xff, 0xe8],
  [0xff, 0xd8, 0xff, 0xdb],
];

// GIF magic bytes
const GIF_SIGNATURES = [
  [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
  [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
];

// WebP magic bytes (RIFF....WEBP)
const WEBP_SIGNATURE_START = [0x52, 0x49, 0x46, 0x46]; // RIFF
const WEBP_SIGNATURE_END = [0x57, 0x45, 0x42, 0x50]; // WEBP

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image MIME type
 */
export function isValidImageType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimeType.toLowerCase());
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number): boolean {
  return size > 0 && size <= MAX_FILE_SIZE;
}

/**
 * Check if byte array starts with signature
 */
function matchesSignature(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  for (let i = 0; i < signature.length; i++) {
    if (bytes[offset + i] !== signature[i]) return false;
  }
  return true;
}

/**
 * Validate image magic bytes (file signature)
 * This prevents files with fake extensions from being processed
 */
export async function validateImageMagicBytes(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check PNG
    if (matchesSignature(bytes, PNG_SIGNATURE)) return true;

    // Check JPEG
    for (const sig of JPEG_SIGNATURES) {
      if (matchesSignature(bytes, sig)) return true;
    }

    // Check GIF
    for (const sig of GIF_SIGNATURES) {
      if (matchesSignature(bytes, sig)) return true;
    }

    // Check WebP
    if (matchesSignature(bytes, WEBP_SIGNATURE_START) && matchesSignature(bytes, WEBP_SIGNATURE_END, 8)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Comprehensive image validation
 */
export async function validateImage(file: File): Promise<ValidationResult> {
  // Check MIME type
  if (!isValidImageType(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: PNG, JPEG, GIF, WebP`,
    };
  }

  // Check file size
  if (!isValidFileSize(file.size)) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxMB}MB`,
    };
  }

  // Validate magic bytes
  const validMagicBytes = await validateImageMagicBytes(file);
  if (!validMagicBytes) {
    return {
      valid: false,
      error: 'Invalid image file format',
    };
  }

  return { valid: true };
}

/**
 * Sanitize filename for safe download
 * Prevents path traversal and removes unsafe characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators
  let sanitized = filename.replace(/[/\\]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove other potentially dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '');

  // Limit length
  if (sanitized.length > 200) {
    const ext = sanitized.split('.').pop() || '';
    const name = sanitized.slice(0, 200 - ext.length - 1);
    sanitized = `${name}.${ext}`;
  }

  // Default filename if empty
  if (!sanitized || sanitized === '.') {
    sanitized = 'export.png';
  }

  return sanitized;
}

/**
 * Generate safe export filename
 */
export function generateExportFilename(prefix = 'ollim'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return sanitizeFilename(`${prefix}-${timestamp}-${random}.png`);
}
