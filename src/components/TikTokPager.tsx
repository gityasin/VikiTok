import React, { ReactNode } from 'react';

interface TikTokPagerProps {
  children: ReactNode[];
  onPageSelected?: (position: number) => void;
  initialPage?: number;
}

// This file serves as a common interface
// The actual implementation is in TikTokPager.web.tsx and TikTokPager.native.tsx
// React Native will automatically choose the right file based on the platform

const TikTokPager: React.FC<TikTokPagerProps> = (props) => {
  // This component should never be rendered directly
  // It's just a placeholder for TypeScript types
  return null;
};

export default TikTokPager; 