import { useEffect, useState } from 'react';

export function useGetTrackingTimeText(
  hoursToTrack: number,
  startTimer: boolean
) {
  const [currentStopTrackingTime, setCurrentStopTrackingTime] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [endTime, setEndTime] = useState<Date>(null);

  useEffect(() => {
    const StopTimeFormatted = calculateHoursToStopTracking(hoursToTrack);
    setCurrentStopTrackingTime(StopTimeFormatted);
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
    if (!endTime || !startTimer) return;
    const interval = setInterval(() => {
      const today = new Date();
      const timeLeft = getTimeDifference(today, endTime);
      setTimeLeft(timeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, startTimer]);

  const calculateHoursToStopTracking = (hours: number) => {
    const hoursToAdd = 1000 * 60 * 60 * hours;
    const stopTime = new Date(new Date().getTime() + hoursToAdd);
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
