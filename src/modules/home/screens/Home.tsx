import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { SubTitle, Screen, LargeTitle, Body, Button } from '@src/components';
import Slider from '@react-native-community/slider';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { useAuthContext } from '@src/context/auth';
import { useGetTrackingTimeText } from '../hooks/useGetTrackingTimeText';
import { useGetAllZones } from '@src/modules/zone/hooks/useGetAllZones';
import * as turf from '@turf/turf';
import {
  startForegroundUpdate,
  stopForegroundUpdate,
} from '../services/ForgroundLocationService';
import { FOREGROUND_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Contants';

export const HomeScreen: FC = () => {
  const { logout } = useAuthContext();
  const theme = useTheme();
  //State
  const [hoursToTrack, setHoursToTrack] = useState(8);
  const [isTracking, setIsTracking] = useState(false);
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

  const toggleForegroundService = () => {
    // stopForegroundUpdate();
    if (isTracking) {
      setIsTracking(false);
      stopForegroundUpdate();
      logout();
    } else {
      setIsTracking(true);
      startForegroundUpdate(taskToRun);
    }
  };

  const taskToRun = (location) => {
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
    //END REMOVE

    setLocation(location);

    const pt = turf.point([12.730018737, 56.025278798]);
    // const pt = turf.point([location.latitude, location.longitude]);
    const features = zones.features;
    let userZones = [];
    features.forEach((zone) => {
      const poly = zone;
      const isInsideZone = turf.booleanPointInPolygon(pt, poly);
      if (isInsideZone) {
        userZones = [...userZones, zone.properties.name];
      }
    });
    console.log('User is in this zone');

    setUserZones(userZones);
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
        {/* Dev only - Remove after Petter test the app */}
        <StyledSericeText>
          {isServiceCalled ? 'Service Called' : '-'}
        </StyledSericeText>

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
        {/* END REMOVE */}
      </Wrapper>
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

const StyledHeader = styled(SubTitle)`
  font-weight: 900;
`;
const StyledBody = styled(Body)``;
const StyledSericeText = styled(Body)`
  color: green;
`;
