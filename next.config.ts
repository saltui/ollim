import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enable XSS filter in browsers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy - restrict sensitive features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval/inline
              "style-src 'self' 'unsafe-inline'", // For inline styles
              "img-src 'self' data: blob:", // Allow data URLs and blobs for images
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'", // Prevent embedding
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
