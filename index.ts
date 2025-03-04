// This file is not being used with expo-router
// The app is using index.js with expo-router/entry as the entry point
// Keep this file for reference but it's not active

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
