module.exports = {
  globDirectory: 'dist',
  globPatterns: ['js/*.js', '**/*.{html,json,css}'],
  swDest: 'dist/service-worker.js',
  swSrc: 'dist/service-worker-sans-manifest.js',
};
