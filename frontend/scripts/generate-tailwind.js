const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const inputCss = path.join(baseDir, 'src', 'tailwind.css');
const outputCss = path.join(baseDir, 'src', 'tailwind.output.css');
const config = require(path.join(baseDir, 'tailwind.config.js'));

const css = fs.readFileSync(inputCss, 'utf8');

postcss([tailwindcss(config), autoprefixer])
  .process(css, { from: inputCss, to: outputCss })
  .then((result) => {
    fs.writeFileSync(outputCss, result.css);
    console.log('[Tailwind] CSS generado correctamente:', result.css.length, 'bytes');
  })
  .catch((err) => {
    console.error('[Tailwind] Error:', err.message);
    process.exit(1);
  });
