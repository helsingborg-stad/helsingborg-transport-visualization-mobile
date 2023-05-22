import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK_NAME } from '@src/utils/Constants';
import { LOCATION_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Constants';

// This global variable is used to share information between
// Task manager and Components
// For now it just sends User location coords
export let serviceStatus = false;

// Start location tracking in background
export const startBackgroundUpdate = async () => {
  // Don't track position if permission is not granted
  const { granted } = await Location.getBackgroundPermissionsAsync();
  if (!granted) {
    console.log('location tracking denied');
    return;
  }

  // Make sure the task is defined otherwise do not start tracking
  const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    console.log('Task is not defined');
    return;
  }

  // Don't track if it is already running in background
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME
  );
  if (hasStarted) {
    console.log('Already started');
    return;
  }
  console.log('starting the task');
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    // For better logs, we set the accuracy to the most sensitive option
    accuracy: Location.Accuracy.Highest,
    timeInterval: LOCATION_SERVICE_CALL_INTERVAL_TIME,
    distanceInterval: 0,
    // Make sure to enable this notification if you want to consistently track in the background
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'Location',
      notificationBody: 'Location tracking in background',
      notificationColor: '#fff',
    },
  });
  serviceStatus = true;
};

// Stop location tracking in background
export const stopBackgroundUpdate = async () => {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME
  );
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    serviceStatus = false;
    console.log('Location tacking stopped');
  }
};
