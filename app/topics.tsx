import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { i18n } from '../src/i18n';
import usePreferenceStore from '../src/stores/preferenceStore';
import { DEFAULT_TOPICS } from '../src/constants';
import { Topic } from '../src/types';

// Map of topic translations for display purposes only
// The actual topic values stored in preferences remain in English
const getTopicTranslation = (topic: string, language: string): string => {
  if (language === 'tr') {
    const translations: Record<string, string> = {
      'History': 'Tarih',
      'Science': 'Bilim',
      'Technology': 'Teknoloji',
      'Art': 'Sanat',
      'Geography': 'Coğrafya'
    };
    return translations[topic] || topic;
  }
  return topic;
};

export default function Topics() {
  const router = useRouter();
  const { preferences, setTopics } = usePreferenceStore();
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);

  // Initialize selected topics from preferences
  useEffect(() => {
    setSelectedTopics(preferences.topics);
  }, [preferences.topics]);

  // Handle topic toggle
  const handleTopicToggle = (topic: Topic) => {
    setSelectedTopics((prevTopics) => {
      if (prevTopics.includes(topic)) {
        return prevTopics.filter((t) => t !== topic);
      } else {
        return [...prevTopics, topic];
      }
    });
  };

  // Handle save topics
  const handleSaveTopics = async () => {
    // Ensure at least one topic is selected
    if (selectedTopics.length === 0) {
      // If no topics are selected, use the default topics
      await setTopics(DEFAULT_TOPICS);
    } else {
      await setTopics(selectedTopics);
    }
    
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('topics.title')}</Text>
        <TouchableOpacity onPress={handleSaveTopics} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{i18n.t('common.save')}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.description}>{i18n.t('topics.selectTopics')}</Text>
        
        <View style={styles.topicsList}>
          {DEFAULT_TOPICS.map((topic) => (
            <View key={topic} style={styles.topicItem}>
              <Checkbox
                status={selectedTopics.includes(topic) ? 'checked' : 'unchecked'}
                onPress={() => handleTopicToggle(topic)}
              />
              <Text style={styles.topicLabel}>
                {i18n.t(`topics.${topic.toLowerCase()}`)}
              </Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.saveTopicsButton}
          onPress={handleSaveTopics}
        >
          <Text style={styles.saveTopicsButtonText}>
            {i18n.t('topics.saveTopics')}
          </Text>
        </TouchableOpacity>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  topicsList: {
    marginBottom: 24,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  saveTopicsButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveTopicsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 