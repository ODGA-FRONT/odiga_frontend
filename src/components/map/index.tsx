'use client';

import Script from 'next/script';

type MapProps = {
  initializeMap: () => void;
};

const Map = ({ initializeMap }: MapProps) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
        onReady={initializeMap}
      />
      <div id={'map'} style={{ width: '100%', height: '500px', overflow: 'auto' }} />
    </>
  );
};

export default Map;
