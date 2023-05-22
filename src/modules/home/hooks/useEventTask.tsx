import { useRef, useState } from 'react';
import { postEvent } from '@src/api/zone';
import * as turf from '@turf/turf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { LOCATION_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Constants';
import { User } from '@src/context/auth/AuthTypes';
import { useGetAllZones } from '@src/modules/home/hooks/useGetAllZones';
import { ZoneFeature } from '../types';
import { LocationObjectCoords } from 'expo-location';
import { EventRequestType } from '@src/api/types';
import { stopBackgroundUpdate } from '../services/BackgroundLocationService';

export function useEventTask() {
  const [isServiceCalled, setIsServiceCalled] = useState(false);
  const [isServiceClosed, setIsServiceClosed] = useState(false);
  const [location, setLocation] = useState(null);
  const [apiCallStatus, setApiCallStatus] = useState<string>('');
  const [userZones, setUserZones] = useState<ZoneFeature[]>(null);
  //
  const [distributionZone, setDistributionZone] = useState(null);
  const [isInsideDistributionZone, setIsInsideDistributionZone] =
    useState(false);
  const [detailEventLog, setDetailEventLog] = useState([]);
  //
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
    formattedZone: EventRequestType,
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

  const shouldShutdownService = async () => {
    try {
      const shutDownTimeStr = await AsyncStorage.getItem('shutDownTime');
      if (shutDownTimeStr && shutDownTimeStr.length > 0) {
        const shutDownTime = parseInt(shutDownTimeStr);
        const currentTime = Date.now();
        if (currentTime > shutDownTime) {
          //We Shut down the tracking!
          await stopBackgroundUpdate();
          setIsServiceClosed(true);
          setIsServiceCalled(false);
          setApiCallStatus('Inactive');
        }
      }
    } catch (e) {
      console.log('Failed to read shutDownTime');
    }
  };

  const readFromAsyncStorage = async (key: string) => {
    try {
      let jsonObject = null;
      const jsonValue = await AsyncStorage.getItem(key);
      jsonObject = jsonValue != null ? JSON.parse(jsonValue) : null;
      return jsonObject;
    } catch (e) {
      console.log('Failed to read ' + key);
      return null;
    }
  };

  const writeToAsyncStorage = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log('Failed to save ' + key + ' in LocalStorage');
    }
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
      if (timeElapsed < LOCATION_SERVICE_CALL_INTERVAL_TIME) {
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

    setDetailEventLog((v) => [...v, '-------------------------']);

    const pt = turf.point([24.688818841, 59.408275184]);
    // const pt = turf.point([location.longitude, location.latitude]);

    //Check the local storage and see if there are any zones
    let zonesToSend: ZoneFeature[] = await readFromAsyncStorage('zonesToSend');
    setDetailEventLog((v) => [
      ...v,
      'Total ZoneToSend(Memory): ' + zonesToSend?.length,
    ]);

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

      //Check if type distribution is in Local storage
      const distributionObject = await readFromAsyncStorage('distributionId');

      const promiseArr: Promise<string>[] = zonesToSend.map(async (zone) => {
        const poly = zone;
        const isInsideZone = turf.booleanPointInPolygon(newPt, poly);
        if (!isInsideZone) {
          setDetailEventLog((v) => [
            ...v,
            'No longer Inside this zone: ' + zone?.properties?.name,
          ]);
          if (
            zone.properties.type &&
            zone.properties.type.toLowerCase() === 'distribution'
          ) {
            distributionZoneId = null;
            setIsInsideDistributionZone(true);
            setDistributionZone(zone);
            await writeToAsyncStorage(
              'distributionId',
              JSON.stringify({ distributionZoneId: zone.properties.id })
            );
          } else {
            if (distributionObject && distributionObject.distributionZoneId) {
              distributionZoneId = distributionObject.distributionZoneId;
            }
          }
          const formattedZone = {
            trackingId: trackingId ?? '',
            distributionZoneId: distributionZoneId ?? null,
            enteredAt: zone.properties.enteredAtTime,
            exitedAt: new Date().toLocaleString('sv-SE', {
              timeZone: 'UTC',
              hour12: false,
            }),
          };
          const eventID = zone.properties.id;
          setDetailEventLog((v) => [
            ...v,
            'Zone event payload: ' + JSON.stringify(formattedZone),
          ]);
          //Call the API
          setApiCallStatus('Attempting to store event');
          return sendEventToServer(eventID, formattedZone, zone.properties.id);
        }
      });

      await Promise.all(promiseArr)
        .then(async (promiseResults) => {
          //we remove undefined or null values
          const results = promiseResults.filter((elem) => elem);

          setDetailEventLog((v) => [
            ...v,
            'Results of Promise.all: ' + JSON.stringify(results),
          ]);

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
            setIsInsideDistributionZone(false);
            setDetailEventLog((v) => [...v, 'No Pending ZonesToSend.']);

            //END REMOVE
          } else {
            const tmpDistID =
              distributionZone && distributionZone.properties.id;

            if (!tmpDistID) {
              setIsInsideDistributionZone(false);
            } else {
              const isDistIDPushed = results.includes(tmpDistID);
              setIsInsideDistributionZone(!isDistIDPushed);
            }

            await writeToAsyncStorage(
              'zonesToSend',
              JSON.stringify(filteredZones)
            );
            setDetailEventLog((v) => [
              ...v,
              'Pending zonesToSend: ' + JSON.stringify(filteredZones?.length),
            ]);
            //Dev only - Remove after Petter test the app
            setZoneNamesForUser(filteredZones);
            //END REMOVE
          }
        })
        .catch((err) => {
          console.log('Failed to store an event', err);
          setApiCallStatus('Could Not store Event, API call Failed -> ' + err);
          setDetailEventLog((v) => [
            ...v,
            'Failed to resolve Promise.all: ' + JSON.stringify(err),
          ]);
        });

      //Clear the API status string
      setTimeout(() => {
        setApiCallStatus('');
      }, 3000);
    }

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
        if (zone.properties.type.toLowerCase() === 'distribution') {
          setDistributionZone(zone);
          setIsInsideDistributionZone(true);
        }
        tmpUserZones = [...tmpUserZones, zone];
      }
    });

    setDetailEventLog((v) => [
      ...v,
      'User is currently inside ' + tmpUserZones?.length + ' zones',
    ]);

    //If zones in local storage does not exist create a new one
    if (zonesToSend) {
      tmpUserZones.forEach((zone) => {
        const tmpZone = zonesToSend.filter(
          (z) => z.properties.id === zone.properties.id
        );

        if (tmpZone.length < 0) {
          zonesToSend.push(zone);
        }
      });
      setDetailEventLog((v) => [
        ...v,
        'Zones to send for next round: ' + zonesToSend?.length,
      ]);

      await writeToAsyncStorage('zonesToSend', JSON.stringify(zonesToSend));
      setZoneNamesForUser(zonesToSend);
    } else {
      await writeToAsyncStorage('zonesToSend', JSON.stringify(tmpUserZones));
      setZoneNamesForUser(tmpUserZones);
      setDetailEventLog((v) => [
        ...v,
        'Zones to send for next round: ' + tmpUserZones?.length,
      ]);
    }

    // Check if the service should be stopped
    // Depending on the Closing timer set by Slider
    await shouldShutdownService();
  };

  return {
    EventTask,
    isServiceCalled,
    isServiceClosed,
    location,
    apiCallStatus,
    userZones,
    distributionZone,
    isInsideDistributionZone,
    detailEventLog,
  };
}
