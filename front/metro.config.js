// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const { mergeConfig } = require('metro-config');

const extraNodeModules = {
  shared: path.resolve(__dirname + '/../shared'),
};

const watchFolders = [path.resolve(__dirname + '/../shared')];

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// module.exports = config;
const config2 = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules,
  },
  watchFolders,
};

module.exports = mergeConfig(config, config2);
