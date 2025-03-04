import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { i18n, setLocale } from '../src/i18n';
import usePreferenceStore from '../src/stores/preferenceStore';

export default function Layout() {
  const { preferences } = usePreferenceStore();

  // Update i18n locale when language preference changes
  useEffect(() => {
    if (preferences.language) {
      setLocale(preferences.language);
    }
  }, [preferences.language]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="topics" />
    </Stack>
  );
} 