const config = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('precss'),
    require('autoprefixer'),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    require('@fullhuman/postcss-purgecss')({
      content: ['dist/**/*.html'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    })
  );
  config.plugins.push(
    require('cssnano')({
      preset: 'default',
    })
  );
}

module.exports = config;
