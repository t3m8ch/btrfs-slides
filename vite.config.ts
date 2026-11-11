import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig(({mode}) => ({
  base: mode === 'static' ? '/btrfs-slides/' : '/',
  plugins: [
    motionCanvas(),
    ...(mode === 'static' ? [] : [ffmpeg()]),
    ...(mode === 'static' ? [{
      name: 'presentation-site',
      config: () => ({build: {rollupOptions: {input: 'index.html'}}}),
    }] : []),
  ],
}));
