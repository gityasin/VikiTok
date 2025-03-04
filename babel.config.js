module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-export-namespace-from',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
}; 