const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Agregar soporte para archivos bin
config.resolver.assetExts.push('bin');

module.exports = config;