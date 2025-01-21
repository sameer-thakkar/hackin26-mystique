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
  exclude: [
    '**/*.d.ts',
    '**/*/types.{js,jsx,ts,tsx}',
    './pages/api/**/*.{js,jsx,ts,tsx}',
    './app/src/(utils|api|hooks)/**/*.{js,jsx,ts,tsx}',
    './node_modules/@headout/espeon/dist/(constants|hooks|types|utils)/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  outdir: 'styled-system',
  importMap: ['@headout/pixie'],
  globalCss: globalStyles,
});
