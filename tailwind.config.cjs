/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blackColor: '#0A0A0A',
        darkColor: '#0f2418',
        semiDarkColor: '#1a3a2e',
        lightColor: '#10b981',
        accentColor: '#34d399',
        labelColor: '#6366f1',
        lightBorderColor: '#e5e7eb',
        errorColor: '#ef4444',
        // Premium palette
        premium: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a3a2e 0%, #0f2418 100%)'
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(16, 185, 129, 0.15)',
        'premium-lg': '0 20px 60px rgba(16, 185, 129, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'inner-premium': 'inset 0 2px 4px 0 rgba(16, 185, 129, 0.1)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          accent: '#34d399',
          primary: '#10b981',
          secondary: '#6366f1',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f3f4f6'
        }
      }
    ]
  },
  plugins: [require('daisyui')]
};
