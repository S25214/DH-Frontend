/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-body': '#0f172a',
        'bg-panel': '#1e293b',
        'bg-input': '#334155',
        'text-main': '#f8fafc',
        'text-muted': '#94a3b8',
        'primary': '#3b82f6',
        'primary-hover': '#2563eb',
        'danger': '#ef4444',
        'success': '#22c55e',
        'border': '#475569',
      },
    },
  },
  plugins: [],
}
