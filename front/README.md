# DESCRIPTION

need to make sure the app.js file in node_modules has this to
enable routing and hot reload
`import "@expo/metro-runtime";
import registerRootComponent from 'expo/build/launch/registerRootComponent';

import App from '../../front/App';
registerRootComponent(App);`

had to export the metro config and add shared modules to it.
`// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const { mergeConfig } = require('metro-config');

const extraNodeModules = {
shared: path.resolve(\_\_dirname + '/../shared'),
};

const watchFolders = [path.resolve(__dirname + '/../shared')];

/\*_ @type {import('expo/metro-config').MetroConfig} _/
const config = getDefaultConfig(\_\_dirname);

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
`
