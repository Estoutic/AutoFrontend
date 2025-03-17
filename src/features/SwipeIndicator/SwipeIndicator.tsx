import React, { useState, useEffect } from 'react';
import styles from './SwipeIndicator.module.scss';

interface SwipeIndicatorProps {
  isFirstVisit?: boolean;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ isFirstVisit = true }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Only show the indicator on first visit
    if (isFirstVisit) {
      // Store that user has seen the indicator
      localStorage.setItem('hasSeenSwipeIndicator', 'true');
      
      // Show after a delay
      const timer = setTimeout(() => {
        setVisible(true);
        
        // Hide after animation completes
        const hideTimer = setTimeout(() => {
          setVisible(false);
        }, 3000);
        
        return () => clearTimeout(hideTimer);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);
  
  if (!visible) return null;
  
  return (
    <div className={styles.swipeIndicator}>
      <div className={styles.swipeAnimation}>
        <div className={styles.hand}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>
          </svg>
        </div>
        <div className={styles.arrow}></div>
      </div>
      <div className={styles.text}>Свайпните для просмотра</div>
    </div>
  );
};

export default SwipeIndicator;