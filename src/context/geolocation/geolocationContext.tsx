// GeolocationContext.tsx

import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as Location from 'expo-location';
import {
  LocationActivityType,
  LocationObject,
  LocationObjectCoords,
} from 'expo-location';
import { ZoneFeature, Zones } from '@src/modules/home/types';
import * as TaskManager from 'expo-task-manager';
import {
  LOCATION_SERVICE_CALL_INTERVAL_TIME,
  LOCATION_TASK_NAME,
} from '@src/utils/Constants';
import { useEventTask } from '@src/modules/home/hooks/useEventTask';

interface GeolocationContextProps {
  isServiceClosed: boolean;
  isServiceCalled: boolean;
  location: LocationObjectCoords;
  recordedLocations: LocationObjectCoords[];
  apiCallStatus: string;
  zones: Zones;
  userZones: ZoneFeature[];
  distributionZone: ZoneFeature;
  isInsideDistributionZone: boolean;
  detailEventLog: string[];
  serviceStatus: boolean;
  stopLocationUpdates: () => Promise<void>;
  startLocationUpdates: () => Promise<void>;
}

const GeolocationContext = createContext<GeolocationContextProps | undefined>(
  undefined
);

interface GeolocationProviderProps {
  children: ReactNode;
}

interface LocationData {
  locations: LocationObject[];
}

export const GeolocationProvider: FC<GeolocationProviderProps> = ({
  children,
}) => {
  const [userLocation, setUserLocation] = useState<LocationObjectCoords>();
  const [serviceStatus, setServiceStatus] = useState<boolean>(false);

  // Define the background task to update userLocation
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const { locations } = data as LocationData;
      setUserLocation(locations[0].coords);
    }
  });

  const startLocationUpdates = async () => {
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
      activityType: LocationActivityType.AutomotiveNavigation,
      timeInterval: LOCATION_SERVICE_CALL_INTERVAL_TIME,
      distanceInterval: 1,
      // Make sure to enable this notification if you want to consistently tr∂ack in the background
      showsBackgroundLocationIndicator: true,
      mayShowUserSettingsDialog: true,
      foregroundService: {
        notificationTitle: 'Plats',
        notificationBody: 'Platsspårning i bakgrunden',
      },
    });

    setServiceStatus(true);
  };

  const stopLocationUpdates = async () => {
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);

    if (!isTaskDefined) {
      setServiceStatus(false);
      console.log('Task is not defined');
      return;
    }

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );

    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setServiceStatus(false);
      console.log('Location tacking stopped');
    }
  };

  const {
    EventTask,
    isServiceClosed,
    isServiceCalled,
    location,
    recordedLocations,
    apiCallStatus,
    zones,
    userZones,
    distributionZone,
    isInsideDistributionZone,
    detailEventLog,
  } = useEventTask(stopLocationUpdates);

  //When location is available we start execute the task
  useEffect(() => {
    if (userLocation) {
      EventTask(userLocation);
    }
  }, [userLocation]);

  return (
    <GeolocationContext.Provider
      value={{
        isServiceClosed,
        isServiceCalled,
        location,
        recordedLocations,
        apiCallStatus,
        zones,
        userZones,
        distributionZone,
        isInsideDistributionZone,
        detailEventLog,
        serviceStatus,
        stopLocationUpdates,
        startLocationUpdates,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
};

export const useGeolocationContext = (): GeolocationContextProps => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error(
      'useGeolocationContext must be used within a GeolocationProvider'
    );
  }
  return context;
};
