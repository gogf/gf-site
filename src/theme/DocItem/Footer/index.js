import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import AdBanner from '@site/src/components/AdBanner';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <AdBanner />
    </>
  );
}
