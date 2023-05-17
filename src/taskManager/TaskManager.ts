import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK_NAME } from '@src/utils/Contants';
import { ZoneFeature } from '@src/modules/home/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      let zonesToSend: ZoneFeature[] = [];

      try {
        const jsonValue = await AsyncStorage.getItem('zonesToSend');
        zonesToSend = jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log('Failed to read zonesToSend');
      }
      console.log('Location in background', zonesToSend);
      console.log(
        '----------------------------------------------------------------'
      );
      console.log('Location in background', location.coords);
    }
  }
});
