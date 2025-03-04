import React, { ReactNode, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

interface TikTokPagerProps {
  children: ReactNode[];
  onPageSelected?: (position: number) => void;
  initialPage?: number;
}

const { height } = Dimensions.get('window');

const TikTokPager: React.FC<TikTokPagerProps> = ({ 
  children, 
  onPageSelected, 
  initialPage = 0 
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle scroll for web platform
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const pageHeight = height;
    const page = Math.round(offsetY / pageHeight);
    
    if (page !== currentPage) {
      setCurrentPage(page);
      
      if (onPageSelected) {
        onPageSelected(page);
      }
    }
  };

  // Scroll to initial page on mount
  React.useEffect(() => {
    if (initialPage > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: initialPage * height,
          animated: false
        });
      }, 100);
    }
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={handleScroll}
      snapToInterval={height}
      decelerationRate="fast"
    >
      {Array.isArray(children) && children.map((child, index) => (
        <View key={index} style={styles.page}>
          {child}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    height,
    width: '100%',
  },
});

export default TikTokPager; 