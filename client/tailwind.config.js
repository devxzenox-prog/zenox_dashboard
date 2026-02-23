export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          card: 'rgba(18, 18, 26, 0.8)',
        },
        accent: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          glow: 'rgba(99, 102, 241, 0.3)',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
