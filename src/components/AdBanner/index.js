import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function AdBanner() {
  // 使用状态来跟踪是否应该显示广告
  const [shouldShowAd, setShouldShowAd] = useState(false);
  
  useEffect(() => {
    // 检查当前域名是否为 goframe.org
    const checkDomain = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // 检查是否为 goframe.org 或其子域名
        const isGoframeDomain = hostname.endsWith('.goframe.org');
        setShouldShowAd(isGoframeDomain);
      }
    };
    
    checkDomain();
  }, []);
  
  // 如果不是 goframe.org 域名，返回 null，不渲染任何内容
  if (!shouldShowAd) {
    return null;
  }
  
  // 如果是 goframe.org 域名，正常显示广告
  return (
    <div className={styles.adContainer}>
      <div className={styles.adBanner}>
        {/* 万维广告 */}
        <div className="wwads-cn wwads-horizontal" data-id="350"></div>
        {/* <p className={styles.adText}>广告位 - 您可以在这里放置您的广告内容</p> */}
      </div>
    </div>
  );
}
