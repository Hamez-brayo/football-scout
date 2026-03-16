// metro.config.js
// Extends the Expo Metro preset so that tsconfig.json path aliases (@/*)
// are resolved at bundle time, not just at TypeScript compile time.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
