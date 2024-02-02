#!/usr/bin/env node
require('esbuild').buildSync({
  entryPoints: ['./src/common.js','./src/index.js','./src/settings.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  // platform: 'node',
  packages: 'external',
  entryNames: '[name].bundle',
  outdir: 'assets',
  loader: { '.ttf': 'file' },
  //loader: { '.ttf': 'dataurl' },
})
