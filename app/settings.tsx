import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { i18n } from '../src/i18n';
import usePreferenceStore from '../src/stores/preferenceStore';
import { Language } from '../src/types';

export default function Settings() {
  const router = useRouter();
  const { preferences, setLanguage } = usePreferenceStore();

  // Handle language change
  const handleLanguageChange = async (language: Language) => {
    await setLanguage(language);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('settings.title')}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.language')}</Text>
          
          <RadioButton.Group
            onValueChange={(value) => handleLanguageChange(value as Language)}
            value={preferences.language}
          >
            <View style={styles.radioItem}>
              <RadioButton value="en" />
              <Text style={styles.radioLabel}>{i18n.t('settings.english')}</Text>
            </View>
            
            <View style={styles.radioItem}>
              <RadioButton value="tr" />
              <Text style={styles.radioLabel}>{i18n.t('settings.turkish')}</Text>
            </View>
          </RadioButton.Group>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.about')}</Text>
          <Text style={styles.aboutText}>VikiTok</Text>
          <Text style={styles.versionText}>{i18n.t('settings.version')}: 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
}); 