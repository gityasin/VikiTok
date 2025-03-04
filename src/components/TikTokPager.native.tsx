import React, { ReactNode, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

interface TikTokPagerProps {
  children: ReactNode[];
  onPageSelected?: (position: number) => void;
  initialPage?: number;
}

const TikTokPager: React.FC<TikTokPagerProps> = ({ 
  children, 
  onPageSelected, 
  initialPage = 0 
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pagerRef = useRef<PagerView>(null);

  // Handle page change for native platforms
  const handlePageChange = (event: { nativeEvent: { position: number } }) => {
    const newPosition = event.nativeEvent.position;
    setCurrentPage(newPosition);
    
    if (onPageSelected) {
      onPageSelected(newPosition);
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      style={styles.container}
      orientation="vertical"
      initialPage={initialPage}
      onPageSelected={handlePageChange}
    >
      {children}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TikTokPager; 