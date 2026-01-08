'use client';

import { useEffect, useCallback } from 'react';
import { validateImage } from '@/lib/security';

export function usePaste(onImagePaste: (imageData: string) => void, onError?: (error: string) => void) {
  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            // Validate image before processing
            const validation = await validateImage(file);
            if (!validation.valid) {
              onError?.(validation.error || 'Invalid image');
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result;
              if (typeof result === 'string') {
                onImagePaste(result);
              }
            };
            reader.onerror = () => {
              onError?.('Failed to read image file');
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    },
    [onImagePaste, onError]
  );

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);
}
