'use client';

import Map from '@/components/map';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { Coordinates, NaverMap } from '@/types/map';
import { useEffect, useRef } from 'react';

export const INITIAL_CENTER: Coordinates = [37.5666103, 126.9783882];
export const INITIAL_ZOOM = 15;

const MapSection = () => {
  const { location, refreshLocation } = useCurrentLocation();

  const mapRef = useRef<NaverMap | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);

  const initializeMap = () => {
    const mapOptions = {
      center: new naver.maps.LatLng(...INITIAL_CENTER),
      logoControl: false, // 네이버 로고 표시 X
      mapDataControl: false, // 지도 데이터 저작권 컨트롤 표시 X
      scaleControl: true, // 지도 축척 컨트롤의 표시 여부
      tileDuration: 200, // 지도 타일을 전환할 때 페이드 인 효과의 지속 시간(밀리초)
      zoom: INITIAL_ZOOM, // 지도의 초기 줌 레벨
      zoomControl: true, // 줌 컨트롤 표시
      zoomControlOptions: { position: 9 }, // 줌 컨트롤 우하단에 배치
    };

    // 새로운 네이버 맵 인스턴스 생성
    const map = new window.naver.maps.Map('map', mapOptions);
    mapRef.current = map;
  };

  const addMarkerAndCenterMap = () => {
    if (location && mapRef.current) {
      const newPosition = new naver.maps.LatLng(...location);

      if (!markerRef.current) {
        const marker = new naver.maps.Marker({
          position: newPosition,
          map: mapRef.current,
          zIndex: 999,
        });
        markerRef.current = marker;
      } else {
        markerRef.current.setPosition(newPosition);
      }

      mapRef.current.setCenter(newPosition);
    }
  };

  useEffect(() => {
    if (location) {
      // 현재위치 파악되면 다시 위치에 맞게끔 지도 그림
      addMarkerAndCenterMap();
    }
  }, [location]);

  useEffect(() => {
    return () => {
      // DOM 요소 제거
      mapRef.current?.destroy();
    };
  }, []);

  return <Map initializeMap={initializeMap} handleCurrentLocation={refreshLocation} />;
};

export default MapSection;
