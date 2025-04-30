import React from 'react';
import TOC from '@theme-original/TOC';
import AdBanner from '@site/src/components/AdBanner';
import styles from './styles.module.css';

export default function TOCWrapper(props) {
  return (
    <div className={styles.tocContainer}>
      <TOC {...props} />
      <div className={styles.tocAdBanner}>
        <AdBanner />
      </div>
    </div>
  );
}
