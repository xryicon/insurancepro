import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // Change this from '/insurancepro/' to '/'
  server: {
    port: 3000,
    open: true
  }
})
