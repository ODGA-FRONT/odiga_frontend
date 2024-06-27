'use client';

import Script from 'next/script';
import styles from './index.module.scss';

type MapProps = {
  initializeMap: () => void;
  handleCurrentLocation: () => void;
};

const Map = ({ initializeMap, handleCurrentLocation }: MapProps) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
        onReady={initializeMap}
      />
      <div id={'map'} className={styles.map}>
        <button className={styles.current_button} onClick={handleCurrentLocation}>
          현재 위치
        </button>
      </div>
    </>
  );
};

export default Map;
