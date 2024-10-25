import { defineConfig } from '@pandacss/dev';
import Preset from '@headout/eevee/tokens';
import { globalStyles } from 'const/globalStyles';

export default defineConfig({
  preflight: false,
  presets: [Preset],
  include: [
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './node_modules/@headout/eevee/dist/atoms/**/*.{js,jsx,ts,tsx}',
    './node_modules/@headout/espeon/dist/**/*.{js,jsx,ts,tsx}',
  ],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: 'styled-system',
  importMap: ['@headout/pixie'],
  globalCss: globalStyles,
});
