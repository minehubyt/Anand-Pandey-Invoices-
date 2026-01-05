import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use the current directory literal './' to resolve type errors and path issues in some environments
  const env = loadEnv(mode, './', '');
  
  return {
    plugins: [react()],
    define: {
      // CRITICAL FIX: Ensure this value is ALWAYS a string.
      // If env.API_KEY is undefined, JSON.stringify(undefined) returns undefined, causing the key to be omitted 
      // from the define object, leaving 'process.env.API_KEY' in the code, which crashes the browser.
      // We added the specific key you provided as a fallback.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || "AIzaSyDPr7P3W8_jtC8-7eP9JtxqafnvM9WdW6Q"),
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});
