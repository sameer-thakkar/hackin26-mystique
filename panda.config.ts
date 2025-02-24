import { defineConfig } from '@pandacss/dev';
import Preset from '@headout/eevee/tokens';
import { globalStyles } from 'const/globalStyles';

export default defineConfig({
  preflight: false,
  lightningcss: true,
  presets: [Preset],
  include: [
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './node_modules/@headout/eevee/dist/**/*.{js,jsx,ts,tsx}',
    './node_modules/@headout/espeon/dist/**/*.{js,jsx,ts,tsx}',
  ],
  exclude: [
    '**/*.d.ts',
    '**/*/(interface|interfaces|type|types|util|utils|constant|constants).{js,jsx,ts,tsx}',
    './components/hooks/**/*.{js,jsx,ts,tsx}',
    './pages/api/**/*.{js,jsx,ts,tsx}',
    './node_modules/@headout/espeon/dist/(constants|hooks|types|utils)/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  outdir: 'styled-system',
  importMap: ['@headout/pixie'],
  jsxFramework: 'react',
  globalCss: globalStyles,
  staticCss: {
    css: [
      {
        properties: {
          WebkitLineClamp: ['1', '2', '3', '4', '5', '6', '7'],
        },
      },
    ],
  },
});
