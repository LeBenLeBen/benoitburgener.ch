module.exports = {
  content: ['./src/**/*.njk'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'max-xs': { max: '639px' },
        'max-sm': { max: '767px' },
      },
    },
    colors: {
      transparent: 'transparent',
      white: 'var(--white)',
      gray: {
        100: 'var(--gray-100)',
        200: 'var(--gray-200)',
        300: 'var(--gray-300)',
        400: 'var(--gray-400)',
        500: 'var(--gray-500)',
        600: 'var(--gray-600)',
        700: 'var(--gray-700)',
        800: 'var(--gray-800)',
        900: 'var(--gray-900)',
      },
      blue: {
        100: 'var(--blue-100)',
        200: 'var(--blue-200)',
        300: 'var(--blue-300)',
        400: 'var(--blue-400)',
        500: 'var(--blue-500)',
        600: 'var(--blue-600)',
        700: 'var(--blue-700)',
        800: 'var(--blue-800)',
        900: 'var(--blue-900)',
      },
      mint: {
        100: 'var(--mint-100)',
        200: 'var(--mint-200)',
        300: 'var(--mint-300)',
        400: 'var(--mint-400)',
        500: 'var(--mint-500)',
        600: 'var(--mint-600)',
        700: 'var(--mint-700)',
        800: 'var(--mint-800)',
        900: 'var(--mint-900)',
      },
    },
    fontFamily: {
      sans: 'MP, sans-serif',
      serif: 'BP, serif',
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        html: {
          fontSize: '20px',
          fontFamily: theme('fontFamily.sans'),
        },
      });
    },
  ],
};
