
import React, { useState } from 'react';
import styles from './InfoTooltip.module.scss';

interface InfoTooltipProps {
  content: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className={styles.infoIcon}>ⓘ</span>
      {isVisible && (
        <div className={styles.tooltipContent}>
          {content}
        </div>
      )}
    </span>
  );
};

export default InfoTooltip;