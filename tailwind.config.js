/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{jsx,tsx}', './components/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        fade_in_up: 'fade_in_up 550ms cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards',
        fade_in_up_down: 'fade_in_up_down 1400ms cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards',
      },
      keyframes: {
        fade_in_up: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fade_in_up_down: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '50%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '70%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
};
