import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  Linking,
  Platform,
} from 'react-native';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
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

  const openLocationSettings = async () => {
    if (Platform.OS === 'android') {
      try {
        await startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
      } catch (error) {
        console.error('Error opening location settings:', error);
      }
    } else if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    }
  };

  const getUserLocationPermission = async () => {
    const fgStatus = await Location.getForegroundPermissionsAsync();
    const bgStatus = await Location.getBackgroundPermissionsAsync();
    const isLocationServicesEnabled = await Location.hasServicesEnabledAsync();

    if (!isLocationServicesEnabled) {
      Alert.alert(
        'Platsbaserade tjänster krävs',
        'För att använda appen krävs att du aktiverar platsbaserade tjänster (GPS). Appen fungerar inte korrekt utan platsbaserade tjänster.',
        [
          {
            text: 'Aktivera Platsbaserade Tjänster',
            onPress: openLocationSettings,
          },
        ]
      );
      return;
    }

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
