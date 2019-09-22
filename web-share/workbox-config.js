module.exports = {
  globDirectory: 'dist',
  globPatterns: ['js/*.js', '**/*.{css,html,json,svg}'],
  swDest: 'dist/service-worker.js',
  swSrc: 'dist/service-worker-sans-manifest.js',
};
