/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static site generation

  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]; // required to make pdfjs work
    return config;
  },

  pwa: {
    dest: 'public',  // Where to generate the PWA assets
    register: true,  // Register the service worker
    skipWaiting: true,  // Skip waiting during service worker update
  },
};

module.exports = nextConfig;