require('esbuild').build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: './index.js',
  platform: 'node',
  target: ['node14'],
})
