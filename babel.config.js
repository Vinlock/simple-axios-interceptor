// const packageJSON = require('./package');

module.exports = function (api) {
  api.cache(true);

  const config = {
    env: {
      production: {
        plugins: [],
        ignore: [],
        presets: [],
      },
      test: {
        presets: [],
        plugins: [],
      },
    },
  };

  /** Plugins */
  // https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from
  config.env.production.plugins.push('@babel/plugin-proposal-export-default-from');
  // https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html
  config.env.production.plugins.push('@babel/plugin-proposal-object-rest-spread');
  // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
  config.env.production.plugins.push('@babel/plugin-proposal-class-properties');
  config.env.production.plugins.push('add-module-exports');
  config.env.production.plugins.push('dynamic-import-node');

  /** Ignore Files */
  config.env.production.ignore.push('./node_modules');
  config.env.production.ignore.push('./dist');
  config.env.production.ignore.push('./*.test.js');

  /** Presets */
  config.env.production.presets.push('@babel/preset-env');

  /** Test Env Presets */
  config.env.test.presets.push([
    '@babel/preset-env',
    {
      modules: 'commonjs',
      targets: { node: 'current' },
    },
  ]);

  /** Test Env Plugins */
  config.env.test.plugins.push('@babel/plugin-proposal-class-properties');
  config.env.test.plugins.push('@babel/plugin-proposal-export-default-from');


  config.env.development = config.env.production;

  return config;
};
