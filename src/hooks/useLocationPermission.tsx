import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

//
// https://github.com/expo/expo/issues/16701#issuecomment-1270111253
//
export function useLocationPermission() {
  //App State
  const appState = useRef(AppState.currentState);

  //LocalState
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] =
    useState(false);
  const [isLocationPermissionDenied, setIsLocationPermissionDenied] =
    useState(false);

  useEffect(() => {
    getUserLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      await getUserLocationPermission();
    }

    appState.current = nextAppState;
  };

  const getUserLocationPermission = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) {
      setIsLocationPermissionGranted(true);
      await Location.requestBackgroundPermissionsAsync();
    } else {
      setIsLocationPermissionGranted(false);
      setIsLocationPermissionDenied(true);
    }
  };

  return {
    isLocationPermissionGranted,
    isLocationPermissionDenied,
  };
}
