import { useAuthContext } from '@src/context/auth';
import { useEffect, useState } from 'react';
import { useGetTrackingTimeText } from '@src/modules/home/hooks/useGetTrackingTimeText';
import { useGeolocationContext } from '@src/context/geolocation/geolocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK_NAME } from '@src/utils/Constants';

export const useHome = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hoursToTrack, setHoursToTrack] = useState(8);
  const [isTracking, setIsTracking] = useState(false);
  const [isChangingServiceStatus, setIsChangingServiceStatus] = useState(false);
  const [showDevInfoModal, setShowDevInfoModal] = useState(false);
  const [oldStateDeleted, setOldStateDeleted] = useState('');
  const [tapCount, setTapCount] = useState(0);

  const { logout } = useAuthContext();
  const { currentStopTrackingTime, timeLeft } = useGetTrackingTimeText(
    hoursToTrack,
    isTracking
  );
  const {
    isServiceClosed,
    isServiceCalled,
    location,
    apiCallStatus,
    userZones,
    trackedEvents,
    distributionZone,
    isInsideDistributionZone,
    detailEventLog,
    stopLocationUpdates,
    startLocationUpdates,
    serviceStatus,
  } = useGeolocationContext();

  const handleTripleTap = () => {
    setTapCount(tapCount + 1);

    if (tapCount === 2) {
      // Reset tap count after triple tap
      setTapCount(0);

      // Show the debug modal
      setShowDevInfoModal(true);
    }
  };

  const onTimerSliderChange = (value: number) => {
    setHoursToTrack(value);
  };

  //Functions
  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      LOCATION_TASK_NAME
    );
    console.log(
      ' ===========> Background Service - ',
      BackgroundFetch.BackgroundFetchStatus[status],
      isRegistered
    );
    setIsChangingServiceStatus(false);
    return {
      isRegistered,
      status: BackgroundFetch.BackgroundFetchStatus[status],
    };
  };

  const toggleLocationService = async () => {
    if (isTracking) {
      await stopLocationUpdates();
      await AsyncStorage.removeItem('recordedLocations');
      await AsyncStorage.removeItem('trackedEvents');
      setIsChangingServiceStatus(true);
      setIsTracking(false);
      logout();
    } else {
      //we reset the local state every time we start the service
      try {
        await AsyncStorage.removeItem('zonesToSend');
        await AsyncStorage.removeItem('recordedLocations');
        await AsyncStorage.removeItem('trackedEvents');
        await AsyncStorage.removeItem('distributionId');
        setOldStateDeleted('Old state deleted when start the service');
      } catch (error) {
        setOldStateDeleted('Failed to delete old state ' + error);
      }

      await startLocationUpdates();
      setIsChangingServiceStatus(true);
      setIsTracking(true);
    }

    checkStatusAsync();
  };

  useEffect(() => {
    const checkServiceStatus = async () => {
      const { isRegistered, status } = await checkStatusAsync();
      //if service is not registered yet and it is available we start on load
      //other wise service is already running so we update the local state
      if (!isRegistered && status?.toLowerCase() === 'available') {
        try {
          await AsyncStorage.removeItem('zonesToSend');
          await AsyncStorage.removeItem('recordedLocations');
          await AsyncStorage.removeItem('trackedEvents');
          await AsyncStorage.removeItem('distributionId');
          setOldStateDeleted('Old state deleted when start the service');
        } catch (error) {
          setOldStateDeleted('Failed to delete old state ' + error);
        }
        await startLocationUpdates();
        setIsChangingServiceStatus(false);
        setIsTracking(true);
      } else {
        setIsTracking(true);
        setIsChangingServiceStatus(false);
      }
    };
    checkServiceStatus();
  }, []);

  useEffect(() => {
    if (isServiceClosed) {
      setIsChangingServiceStatus(true);
      setIsTracking(false);
      logout();
    }
  }, [isServiceClosed]);

  //update if the service is still tracking
  useEffect(() => {
    if (serviceStatus) {
      setIsTracking(serviceStatus);
    }
  }, [serviceStatus]);

  return {
    isChangingServiceStatus,
    showDevInfoModal,
    oldStateDeleted,
    currentStopTrackingTime,
    timeLeft,
    isServiceCalled,
    location,
    apiCallStatus,
    userZones,
    trackedEvents,
    distributionZone,
    isInsideDistributionZone,
    detailEventLog,
    handleTripleTap,
    toggleLocationService,
    isServiceClosed,
    isTracking,
    hoursToTrack,
    setShowDevInfoModal,
    onTimerSliderChange,
    currentPage,
    setCurrentPage,
  };
};
