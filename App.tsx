import React from 'react';
import { LogBox } from 'react-native';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Unsupported top level event type "topInsetsChange" dispatched',
  'TapGestureHandler must be used as a descendant of GestureHandlerRootView',
  // Keep other warnings you want to ignore
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <PaperProvider>
          <Slot />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}