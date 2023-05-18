import { FOREGROUND_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Contants';
import * as Location from 'expo-location';
let foregroundSubscription = null;

export const startForegroundUpdate = async (callback) => {
  // Check if foreground permission is granted
  const { granted } = await Location.getForegroundPermissionsAsync();
  if (!granted) {
    console.log('location tracking denied');
    return;
  }

  // Make sure that foreground location tracking is not running
  foregroundSubscription?.remove();

  // Start watching position in real-time
  foregroundSubscription = await Location.watchPositionAsync(
    {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.High,
      timeInterval: FOREGROUND_SERVICE_CALL_INTERVAL_TIME,
      distanceInterval: 0,
    },
    (location) => {
      callback(location.coords);
    }
  );
};

// Stop location tracking in foreground
export const stopForegroundUpdate = () => {
  foregroundSubscription?.remove();
  console.log('Service stopped');
};
