import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  SubTitle,
  Screen,
  LargeTitle,
  Body,
  Button,
  Modal,
  ModalChildContainer,
  ModalBackDrop,
} from '@src/components';
import Slider from '@react-native-community/slider';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '@src/context/auth';
import { useGetTrackingTimeText } from '../hooks/useGetTrackingTimeText';
import { useGetAllZones } from '@src/modules/zone/hooks/useGetAllZones';
import * as turf from '@turf/turf';
import {
  startForegroundUpdate,
  stopForegroundUpdate,
} from '../services/ForgroundLocationService';
import { FOREGROUND_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Contants';
import { User } from '@src/context/auth/AuthTypes';
import { postEvent } from '@src/api/zone';

//
//
//
export const HomeScreen: FC = () => {
  const { logout } = useAuthContext();
  const theme = useTheme();
  //State
  const [hoursToTrack, setHoursToTrack] = useState(8);
  const [isTracking, setIsTracking] = useState(false);
  const [showDevInfoModal, setShowDevInfoModal] = useState(false);
  const [apiCallStatus, setApiCallStatus] = useState('');
  //Foreground
  const [location, setLocation] = useState(null);
  const [userZones, setUserZones] = useState(null);
  const [isServiceCalled, setIsServiceCalled] = useState(false);
  const serviceTimeRef = useRef(null);
  //Hooks
  const { currentStopTrackingTime, timeLeft } = useGetTrackingTimeText(
    hoursToTrack,
    isTracking
  );

  //Get All getAllZones
  const { zones } = useGetAllZones();

  const toggleForegroundService = async () => {
    // stopForegroundUpdate();
    if (isTracking) {
      setIsTracking(false);
      stopForegroundUpdate();
      logout();
    } else {
      await AsyncStorage.removeItem('zonesToSend');
      setIsTracking(true);
      startForegroundUpdate(taskToRun);
      setShowDevInfoModal(true);
    }
  };

  const taskToRun = async (location) => {
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

    // const pt = turf.point([12.730018737, 56.025278798]);
    const pt = turf.point([location.latitude, location.longitude]);

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
      // const newPt = turf.point([100.730018737, 100.025278798]);

      zonesToSend.forEach(async (zone) => {
        const poly = zone;
        const isInsideZone = turf.booleanPointInPolygon(pt, poly);

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

  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Wrapper>
        <StyledSubTitle>Automatisk stopptid</StyledSubTitle>
        <TimerContainer>
          <StyledTimerText>{currentStopTrackingTime}</StyledTimerText>
        </TimerContainer>
        <StyledBodyText>{timeLeft}</StyledBodyText>
        <SliderContainer>
          <StyledSlider
            minimumValue={1}
            maximumValue={12}
            value={hoursToTrack}
            thumbTintColor={theme.colors.primary.main}
            minimumTrackTintColor={theme.colors.primary.main}
            maximumTrackTintColor={theme.colors.primary.backgroundHighlight}
            onValueChange={(val) => setHoursToTrack(val)}
            step={1}
          />
          <SliderMinMaxContiner>
            <StyledRangeText>1 h</StyledRangeText>
            <Filler />
            <StyledRangeText>12 h</StyledRangeText>
          </SliderMinMaxContiner>
        </SliderContainer>
        <StyleButton
          title={isTracking ? 'Stoppa körning' : 'Starta körning'}
          type="primary"
          onPress={() => {
            toggleForegroundService();
          }}
        />
      </Wrapper>
      {/* Remove modal after testing with Peter */}
      <StyledModal visible={showDevInfoModal}>
        <ModalBackDrop onPress={() => setShowDevInfoModal(false)} />
        <StyledModalChildContainer>
          <StyledServiceContainer>
            <StyledHeader>Service Status:</StyledHeader>
            <StyledServiceText>
              {isServiceCalled ? 'Running' : 'Waiting'}
            </StyledServiceText>
          </StyledServiceContainer>
          <StyledUserLocationContainer>
            <StyledHeader>API call status:</StyledHeader>
            <StyledApiText>
              {apiCallStatus.length > 1 ? apiCallStatus : 'Waiting'}
            </StyledApiText>
          </StyledUserLocationContainer>

          <StyledUserLocationContainer>
            <StyledHeader>Location:</StyledHeader>
            {location && (
              <StyledBody>
                {location.latitude}, {location.longitude}
              </StyledBody>
            )}
          </StyledUserLocationContainer>

          <StyledUserZonesContainer>
            <StyledHeader>Zones:</StyledHeader>
            {userZones && <StyledBody>{JSON.stringify(userZones)}</StyledBody>}
          </StyledUserZonesContainer>
        </StyledModalChildContainer>
      </StyledModal>
    </StyledScreen>
  );
};
const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
}))``;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StyledSubTitle = styled(SubTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const TimerContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.xxl}`};
  border-radius: 15px;
  margin: 10px;
`;

const StyledTimerText = styled(LargeTitle)``;

const StyledBodyText = styled(Body)`
  color: #e1e1e1;
`;
const StyledRangeText = styled(Body)`
  color: ${({ theme }) => theme.colors.primary.borderColor};
`;

const SliderContainer = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.space.xxl};
  padding: ${({ theme }) => `0 ${theme.space.lg}`};
  justify-content: center;
  align-items: center;
`;

const SliderMinMaxContiner = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) =>
    `0 ${Platform.OS !== 'ios' ? theme.space.md : '0px'}`};
`;

const Filler = styled.View`
  flex: 1;
  height: 0;
`;

const StyleButton = styled(Button)`
  width: 60%;
  margin-top: ${({ theme }) => theme.space.xxxl};
  align-self: center;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  height: 40px;
`;

const StyledUserLocationContainer = styled.View`
  flex-direction: column;
  width: 100%;
  margin: 10px;
`;

const StyledUserZonesContainer = styled(StyledUserLocationContainer)`
  margin-top: 0;
`;

const StyledServiceContainer = styled(StyledUserLocationContainer)`
  margin-top: 0;
  flex-direction: row;
  gap: 10px;
`;

const StyledHeader = styled(SubTitle)`
  font-weight: 900;
`;
const StyledBody = styled(Body)``;

const StyledServiceText = styled(Body)`
  color: green;
`;
const StyledApiText = styled(Body)``;

//
const StyledModal = styled(Modal)`
  width: 50%;
`;

const StyledModalChildContainer = styled(ModalChildContainer)`
  padding: 20px;
  width: 100%;
`;
