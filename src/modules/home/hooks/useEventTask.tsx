import { useRef, useState } from 'react';
import { postEvent } from '@src/api/zone';
import * as turf from '@turf/turf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { FOREGROUND_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Contants';
import { User } from '@src/context/auth/AuthTypes';
import { useGetAllZones } from '@src/modules/home/hooks/useGetAllZones';
import { ZoneFeature } from '../types';
import { LocationObjectCoords } from 'expo-location';

type FormattedZone = {
  trackingId: string;
  distributionZoneId: string;
  enteredAt: string;
  exitedAt: string;
};

export function useEventTask() {
  const [isServiceCalled, setIsServiceCalled] = useState(false);
  const [location, setLocation] = useState(null);
  const [apiCallStatus, setApiCallStatus] = useState<string>('');
  const [userZones, setUserZones] = useState<ZoneFeature[]>(null);
  const serviceTimeRef = useRef(null);

  //Get All getAllZones
  const { zones } = useGetAllZones();

  //Test Only Methods: For Petter
  const setZoneNamesForUser = (zonesToParse: ZoneFeature[]) => {
    //Dev only - Remove after Petter test the app
    let userZoneName = [];
    zonesToParse.forEach((zone) => {
      userZoneName = [...userZoneName, zone.properties.name];
    });
    setUserZones(userZoneName);
    //END REMOVE
  };

  const sendEventToServer = (
    eventID: string,
    formattedZone: FormattedZone,
    zoneID: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      postEvent(eventID, formattedZone)
        .then(() => {
          resolve(zoneID);
        })
        .catch(() => {
          reject(zoneID);
        });
    });
  };

  const EventTask = async (location: LocationObjectCoords) => {
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
    let zonesToSend: ZoneFeature[] = [];

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

      const promises: Promise<string>[] = [];
      //Check if type distibution is in Local storage
      const distributionId = await SecureStore.getItemAsync('distributionId');
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
            if (distributionId) {
              distributionZoneId = distributionId;
            }
          }
          const foramttedZone = {
            trackingId: trackingId + ' BG-SERICE-TEST-22',
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
          const result = sendEventToServer(
            eventID,
            foramttedZone,
            zone.properties.id
          );
          promises.push(result);
        }
      });

      Promise.all(promises)
        .then(async (results) => {
          console.log('All done', results);
          setApiCallStatus(
            'Event stored successfully (' + results.length + ')'
          );
          //Now remove the zones from the zonesToSend
          const filteredZones = zonesToSend.filter(
            (z) => !results.includes(z.properties.id)
          );
          if (filteredZones.length < 1) {
            //delete the zonesToSend local storage
            await AsyncStorage.removeItem('zonesToSend');
            zonesToSend = null;
            //Dev only - Remove after Petter test the app
            setZoneNamesForUser([]);
            //END REMOVE
          } else {
            try {
              await AsyncStorage.setItem(
                'zonesToSend',
                JSON.stringify(filteredZones)
              );
            } catch (e) {
              console.log('Failed to save zonesToSend in LocalStorage');
            }
            //Dev only - Remove after Petter test the app
            setZoneNamesForUser(filteredZones);
            //END REMOVE
          }
        })
        .catch((err) => {
          console.log('Failed to store an event', err);
          setApiCallStatus('Could Not store Event, API call Failed -> ' + err);
        });
      //Clear the API status string
      setTimeout(() => {
        setApiCallStatus('');
      }, 3000);
    }
    // return;
    //After its done -> just move on as normal flow
    const features = zones.features;
    let tmpUserZones: ZoneFeature[] = [];
    features.forEach(async (zone) => {
      const poly = zone;
      const isInsideZone = turf.booleanPointInPolygon(pt, poly);
      if (isInsideZone) {
        zone.properties.enteredAtTime = new Date().toLocaleString('sv-SE', {
          timeZone: 'UTC',
          hour12: false,
        });
        tmpUserZones = [...tmpUserZones, zone];
      }
    });

    //If zones in local storage does not exist create a new one
    if (zonesToSend) {
      tmpUserZones.forEach((zone) => {
        const tmpZone = zonesToSend.filter(
          (z) => z.properties.id === zone.properties.id
        );
        if (!tmpZone) {
          zonesToSend.push(zone);
        }
      });

      try {
        await AsyncStorage.setItem('zonesToSend', JSON.stringify(zonesToSend));
        //Dev only - Remove after Petter test the app
        setZoneNamesForUser(zonesToSend);
        //END REMOVE
      } catch (e) {
        console.log('Failed to save zonesToSend in LocalStorage');
      }
    } else {
      try {
        await AsyncStorage.setItem('zonesToSend', JSON.stringify(tmpUserZones));
        //Dev only - Remove after Petter test the app
        setZoneNamesForUser(tmpUserZones);
        //END REMOVE
      } catch (e) {
        console.log('Failed to save zonesToSend in LocalStorage');
      }
    }
  };

  return { EventTask, isServiceCalled, location, apiCallStatus, userZones };
}
