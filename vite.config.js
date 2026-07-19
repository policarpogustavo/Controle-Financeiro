import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Controle-Financeiro/' : '/',
  plugins: [react()],
  server: {
    open: true,
  },
}))
