const config = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.cssnano = {
    preset: 'default',
  };
}

export default config;
