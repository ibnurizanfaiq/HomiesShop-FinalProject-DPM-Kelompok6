module.exports = {
    presets: [
      'babel-preset-expo',
      '@babel/preset-react', 
    ],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          blacklist: null,
          whitelist: null,
          safe: true,
          allowUndefined: false,
          verbose: false,
        },
      ],
    ],
  };