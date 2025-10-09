
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
server: {

port: 3000,

open: true,

proxy: {

// tudo que começar com /api será redirecionado pro backend

'/api': {

target: 'http://localhost:3001',

changeOrigin: true,

secure: false,

},

},

},

});
