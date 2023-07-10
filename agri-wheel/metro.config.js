const defaultAssetExts = require("metro-config/src/defaults/defaults").assetExts;
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: [
        ...defaultAssetExts, // <- array spreading defaults
        'bin'
    ]
}
};
// const { getDefaultConfig } = require('metro-config');
// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig();
//   const { assetExts } = defaultConfig.resolver;
//   return {
//     resolver: {
//       // Add bin to assetExts
//       assetExts: [...assetExts, 'bin'],
//     }
//   };
// })();
