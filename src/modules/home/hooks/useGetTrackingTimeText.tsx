import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useGetTrackingTimeText(
  hoursToTrack: number,
  isTracking: boolean
) {
  const [currentStopTrackingTime, setCurrentStopTrackingTime] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [endTime, setEndTime] = useState<Date>(null);

  useEffect(() => {
    const getStopTimeFormatted = async () => {
      const StopTimeFormatted = await calculateHoursToStopTracking(
        hoursToTrack
      );
      setCurrentStopTrackingTime(StopTimeFormatted);
    };
    getStopTimeFormatted();
  }, [hoursToTrack]);

  //Get Time Remaining
  useEffect(() => {
    if (!endTime) return;
    const today = new Date();
    const timeLeft = getTimeDifference(today, endTime);
    setTimeLeft(timeLeft);
  }, [endTime]);

  //Set an interval to auto calculate the time remaining
  useEffect(() => {
    if (!endTime || !isTracking) return;
    const interval = setInterval(() => {
      const today = new Date();
      const timeLeft = getTimeDifference(today, endTime);
      setTimeLeft(timeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, isTracking]);

  const calculateHoursToStopTracking = async (hours: number) => {
    // const hoursToAdd = 1000 * 60 * 60 * hours;
    const hoursToAdd = 1000 * 60 * hours;
    const stopTime = new Date(new Date().getTime() + hoursToAdd);
    // We save the Shutdown time to local storage for auto
    // Shutdown of LocationService
    try {
      //Store new value, it should overwrite the old value
      const timeToStore = {
        stopTime: Date.parse(stopTime.toISOString()),
        startTime: Date.now(),
      };
      await AsyncStorage.setItem('shutDownTime', JSON.stringify(timeToStore));
    } catch (e) {
      console.log('Failed to store shutDownTime');
      //Service will not shut down automatically!
      //Do proper error handling
    }

    let StopTimeFormatted = stopTime.toLocaleString([], {
      hour12: false,
    });
    StopTimeFormatted = StopTimeFormatted.slice(-8).slice(0, -3);
    setEndTime(stopTime);
    return StopTimeFormatted;
  };

  const getTimeDifference = (startTime, endTime) => {
    if (hoursToTrack < 1) return '';
    const difference = endTime - startTime;
    const differenceInMinutes = Math.floor(difference / 1000 / 60);
    let hours = Math.floor(differenceInMinutes / 60);
    if (hours < 0) {
      hours = 0;
    }
    let minutes = Math.floor(differenceInMinutes % 60);
    if (minutes < 0) {
      minutes = 60 + minutes;
    }

    const seconds = Math.floor((Math.abs(difference) / 1000) % 60);

    const hoursAndMinutes = `om ${hours} tim ${minutes
      .toString()
      .padStart(2, '0')} min ${seconds.toString().padStart(2, '0')} sekunder`;
    return hoursAndMinutes;
  };

  return {
    currentStopTrackingTime,
    timeLeft,
  };
}
