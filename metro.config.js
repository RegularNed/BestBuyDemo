const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
};

config.transformer = {
  ...config.transformer,
  // Force HTTP/1.1 for fetch on Android
  unstable_transformProfile: 'hermes-stable',
};

module.exports = config;
