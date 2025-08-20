import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// reemplaza REPO por el nombre real del repositorio
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
})
