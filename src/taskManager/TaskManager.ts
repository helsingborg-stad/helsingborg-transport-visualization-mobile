import { LOCATION_TASK_NAME } from '@src/utils/Constants';
import * as TaskManager from 'expo-task-manager';
import { LocationObjectCoords } from 'expo-location';

// This global variable is used to share information between
// Task manager and Components
// For now it just sends User location coords
export let userLocation: LocationObjectCoords = null;

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  console.log('Task called');
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    // Extract location coordinates from data
    // @ts-expect-error: Its location object - how to add type here? :/
    const { locations } = data;
    const location = locations[0];
    if (location) {
      userLocation = location.coords;
    }
  }
});
