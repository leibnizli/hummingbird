#!/usr/bin/env node
import * as esbuild from 'esbuild'

let ctx = await esbuild.context({
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
await ctx.watch()
console.log('watching...')
