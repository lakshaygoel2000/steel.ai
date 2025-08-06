import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mov'],
  server:{
    host: true, // Allows LAN/mobile access
    port: 5173,
    strictPort: true,
    cors: {
      origin: [
        'http://localhost:5173',
        'https://450b32c94f04.ngrok-free.app', // your ngrok URL
      ],
      credentials: true,
    },
    hmr: {
      protocol: 'wss', // WebSocket Secure for HMR to work via ngrok
      host: '450b32c94f04.ngrok-free.app',
    },
    // optional if you're using `vite-allowed-hosts` plugin
    allowedHosts: ['450b32c94f04.ngrok-free.app'],
  }
});
