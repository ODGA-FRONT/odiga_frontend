'use client';

import Map from '@/components/map';
import { Coordinates, NaverMap } from '@/types/map';
import { useEffect, useRef, useState } from 'react';

export const INITIAL_CENTER: Coordinates = [37.5666103, 126.9783882];
export const INITIAL_ZOOM = 15;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const MapSection = () => {
  const mapRef = useRef<NaverMap | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const currentLocationRef = useRef<Coordinates>();
  const [error, setError] = useState('');

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    const newLocation: Coordinates = [latitude, longitude];
    currentLocationRef.current = newLocation;
    addMarkerMap(currentLocationRef.current);
  };

  const handleError = (err: GeolocationPositionError) => {
    currentLocationRef.current = [...INITIAL_CENTER];
    setError('Unable to retrieve location.');
  };

  // 현재위치 갱신 함수
  const refreshLocation = () => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }
    setInterval(() => {
      geolocation.getCurrentPosition(handleSuccess, handleError, options);
    }, 1000);
  };

  const initializeMap = () => {
    const { geolocation } = navigator;
    // 최초 실행함수
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

    if (geolocation) {
      const handleSuccess = (pos: GeolocationPosition) => {
        const { latitude, longitude } = pos.coords;
        const newLocation: Coordinates = [latitude, longitude];

        if (map) {
          const newPosition = new naver.maps.LatLng(...newLocation);
          if (!markerRef.current) {
            const marker = new naver.maps.Marker({
              position: newPosition,
              map: map,
              zIndex: 999,
            });
            markerRef.current = marker;
          } else {
            markerRef.current.setPosition(newPosition);
          }
          map.setCenter(newPosition);
        }
      };

      geolocation.getCurrentPosition(
        handleSuccess,
        () => {
          console.log('err');
        },
        options,
      );
    }
  };

  const addMarkerMap = (location: Coordinates) => {
    // marker를 map에 새로 만드는 함수
    if (mapRef.current) {
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
      return newPosition;
    }
  };

  const handleCurrentLocation = () => {
    // 현재위치 눌러졌을 때, 호출되는 함수
    // 위치 바꾸고, 중간으로 보냄
    if (currentLocationRef.current) {
      const newPosition = addMarkerMap(currentLocationRef.current);
      if (mapRef.current && newPosition) {
        mapRef.current.setCenter(newPosition);
      }
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  useEffect(() => {
    return () => {
      // DOM 요소 제거
      mapRef.current?.destroy();
    };
  }, []);

  return <Map initializeMap={initializeMap} handleCurrentLocation={handleCurrentLocation} />;
};

export default MapSection;
