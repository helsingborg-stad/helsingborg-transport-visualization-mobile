import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

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
  const [
    isLocationBackgroundPermissionNeeded,
    setIsLocationBackgroundPermissionNeeded,
  ] = useState(false);

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
    const fgStatus = await Location.getForegroundPermissionsAsync();
    const bgStatus = await Location.getBackgroundPermissionsAsync();

    if (fgStatus.granted && bgStatus.granted) {
      setIsLocationPermissionGranted(true);
      return;
    }

    if (!fgStatus.granted && fgStatus.canAskAgain) {
      const tmpStatus = await Location.requestForegroundPermissionsAsync();
      if (tmpStatus.granted) {
        setIsLocationPermissionGranted(true);
        if (Platform.OS === 'ios') {
          await Location.requestBackgroundPermissionsAsync();
        } else {
          setIsLocationBackgroundPermissionNeeded(true);
        }
      } else {
        setIsLocationPermissionDenied(true);
      }
    } else {
      setIsLocationPermissionDenied(true);
    }
  };

  return {
    isLocationPermissionGranted,
    isLocationPermissionDenied,
    isLocationBackgroundPermissionNeeded,
  };
}
