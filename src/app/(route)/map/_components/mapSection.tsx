'use client';

import Map from '@/components/map';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { Coordinates, NaverMap } from '@/types/map';
import { useEffect, useRef } from 'react';

export const INITIAL_CENTER: Coordinates = [37.5666103, 126.9783882];
export const INITIAL_ZOOM = 10;

const MapSection = () => {
  const { location } = useCurrentLocation();

  const mapRef = useRef<NaverMap | null>(null);

  const initializeMap = () => {
    if (location) {
      const mapOptions = {
        center: new naver.maps.LatLng(...location),
        logoControl: false, // 네이버 로고 표시 X
        mapDataControl: false, // 지도 데이터 저작권 컨트롤 표시 X
        scaleControl: true, // 지도 축척 컨트롤의 표시 여부
        tileDuration: 200, // 지도 타일을 전환할 때 페이드 인 효과의 지속 시간(밀리초)
        zoom: 15, // 지도의 초기 줌 레벨
        zoomControl: true, // 줌 컨트롤 표시
        zoomControlOptions: { position: 9 }, // 줌 컨트롤 우하단에 배치
      };
      //새로운 네이버 맵 인스턴스 생성
      const map = new window.naver.maps.Map('map', mapOptions);
      mapRef.current = map;

      new naver.maps.Marker({
        // 생성될 마커의 위치
        position: new naver.maps.LatLng(...location),
        // 마커를 표시할 Map 객체
        map: mapRef.current,
        zIndex: 999,
      });
    }
  };

  useEffect(() => {
    return () => {
      // DOM 요소 제거
      mapRef.current?.destroy();
    };
  }, []);

  return <>{location && <Map initializeMap={initializeMap} />}</>;
};

export default MapSection;
