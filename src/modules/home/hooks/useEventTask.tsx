import { useRef, useState } from 'react';
import { postEvent } from '@src/api/zone';
import * as turf from '@turf/turf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { FOREGROUND_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Contants';
import { User } from '@src/context/auth/AuthTypes';
import { useGetAllZones } from '@src/modules/zone/hooks/useGetAllZones';

export function useEventTask() {
  const [isServiceCalled, setIsServiceCalled] = useState(false);
  const [location, setLocation] = useState(null);
  const [apiCallStatus, setApiCallStatus] = useState('');
  const [userZones, setUserZones] = useState(null);
  const serviceTimeRef = useRef(null);

  //Get All getAllZones
  const { zones } = useGetAllZones();

  const EventTask = async (location) => {
    // if zones or location is not available then we cannot do anything
    // just return
    if (!zones || !location) {
      console.log('zones or location not ready yet');
      return;
    }
    // If we have a service call and it is called again before the limit
    // we do nothing
    if (serviceTimeRef.current) {
      const currTime = Date.now();
      const timeElapsed = currTime - serviceTimeRef.current;
      if (timeElapsed < FOREGROUND_SERVICE_CALL_INTERVAL_TIME) {
        console.log('Called Too Soon!');
        return;
      }
    }

    serviceTimeRef.current = Date.now();

    //Dev only - Remove after Petter test the app
    setIsServiceCalled(true);
    setTimeout(() => {
      setIsServiceCalled(false);
    }, 3000);

    setLocation(location);
    //END REMOVE

    const pt = turf.point([12.730018737, 56.025278798]);
    // const pt = turf.point([location.latitude, location.longitude]);

    //Check the local storage and see if there are any zones
    let zonesToSend = [];

    try {
      const jsonValue = await AsyncStorage.getItem('zonesToSend');
      zonesToSend = jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('Failed to read zonesToSend');
    }

    if (zonesToSend) {
      //Get Tracking ID
      //check if we already have a tracking id in local storage
      let trackingId = '';
      const userStr = await SecureStore.getItemAsync('user');
      const user: User = JSON.parse(userStr);

      if (user) {
        trackingId = user.trackingId;
      }

      let distributionZoneId = null;
      const newPt = turf.point([100.730018737, 100.025278798]);

      zonesToSend.forEach(async (zone) => {
        const poly = zone;
        const isInsideZone = turf.booleanPointInPolygon(newPt, poly);

        if (!isInsideZone) {
          if (
            zone.properties.type &&
            zone.properties.type.toLowerCase() === 'distribution'
          ) {
            distributionZoneId = zone.properties.id;
            SecureStore.setItemAsync(
              'distributionId',
              JSON.stringify(zone.properties.id)
            );
          } else {
            //Check if type distibution is in Local storage
            const distributionId = await SecureStore.getItemAsync(
              'distributionId'
            );
            if (distributionId) {
              distributionZoneId = distributionId;
            }
          }
          const foramttedZone = {
            trackingId: trackingId,
            distributionZoneId: distributionZoneId,
            enteredAt: zone.properties.enteredAtTime,
            exitedAt: new Date().toLocaleString('sv-SE', {
              timeZone: 'UTC',
              hour12: false,
            }),
          };
          const eventID = zone.properties.id;
          //Call the API
          setApiCallStatus('Attempting to store event');
          postEvent(eventID, foramttedZone)
            .then(() => {
              setApiCallStatus('Event stored successfully');
            })
            .catch((err) => {
              setApiCallStatus(
                'Could Not store Event, API call Failed -> ' + err
              );
            });

          setTimeout(() => {
            setApiCallStatus('');
          }, 5000);
        }
      });
    }

    //After its done -> just move on as normal flow
    const features = zones.features;
    let userZones = [];
    features.forEach(async (zone) => {
      const poly = zone;
      const isInsideZone = turf.booleanPointInPolygon(pt, poly);
      if (isInsideZone) {
        zone.properties.enteredAtTime = new Date().toLocaleString('sv-SE', {
          timeZone: 'UTC',
          hour12: false,
        });
        userZones = [...userZones, zone];
      }
    });

    //If zones in local storage does not exist create a new one
    if (zonesToSend) {
      userZones.forEach((zone) => {
        const tmpZone = zonesToSend.filter(
          (z) => z.properties.id === zone.properties.id
        );
        if (!tmpZone) {
          zonesToSend.push(zone);
        }
      });

      //Dev only - Remove after Petter test the app
      let userZoneName = [];
      zonesToSend.forEach((zone: any) => {
        userZoneName = [...userZoneName, zone.properties.name];
      });
      setUserZones(userZoneName);
      //END REMOVE

      try {
        await AsyncStorage.setItem('zonesToSend', JSON.stringify(zonesToSend));
      } catch (e) {
        console.log('Failed to save zonesToSend in LocalStorage');
      }
    } else {
      //Dev only - Remove after Petter test the app
      let userZoneName = [];
      userZones.forEach((zone) => {
        userZoneName = [...userZoneName, zone.properties.name];
      });
      setUserZones(userZoneName);
      //END REMOVE
      try {
        await AsyncStorage.setItem('zonesToSend', JSON.stringify(userZones));
      } catch (e) {
        console.log('Failed to save zonesToSend in LocalStorage');
      }
    }
  };

  return { EventTask, isServiceCalled, location, apiCallStatus, userZones };
}
