import React, { FC, useEffect, useState } from 'react';
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
  Code,
} from '@src/components';

import Slider from '@react-native-community/slider';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '@src/context/auth';
import { useGetTrackingTimeText } from '../hooks/useGetTrackingTimeText';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK_NAME } from '@src/utils/Constants';
import { userLocation } from '@src/taskManager/TaskManager';
import { serviceStatus } from '../services/BackgroundLocationService';
import {
  stopBackgroundUpdate,
  startBackgroundUpdate,
} from '../services/BackgroundLocationService';
import { useEventTask } from '../hooks/useEventTask';

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
  const [isChangingServiceStatus, setIsChangingServiceStatus] = useState(false);
  const [oldStateDeleted, setOldStateDeleted] = useState('');
  const [counter, setCounter] = useState(0);

  //Hooks
  const { currentStopTrackingTime, timeLeft } = useGetTrackingTimeText(
    hoursToTrack,
    isTracking
  );

  const {
    EventTask,
    isServiceCalled,
    isServiceClosed,
    location,
    apiCallStatus,
    userZones,
    distributionZone,
    isInsideDistributionZone,
    detailEventLog,
  } = useEventTask();

  // Use Effects
  useEffect(() => {
    checkStatusAsync();
    toggleLocationService();
  }, []);

  useEffect(() => {
    if (userLocation) {
      EventTask(userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
    if (serviceStatus) {
      setIsTracking(serviceStatus);
    }
  }, [serviceStatus]);

  useEffect(() => {
    if (isServiceCalled) {
      setCounter(0);
    }
  }, [isServiceCalled]);

  useEffect(() => {
    let interval = null;
    setCounter(0);
    interval = setInterval(() => {
      setCounter((v) => v + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //Functions
  const toggleLocationService = async () => {
    if (isTracking) {
      await stopBackgroundUpdate();
      setIsChangingServiceStatus(true);
      logout();
    } else {
      //we reset the local state every time we start the service
      try {
        await AsyncStorage.removeItem('zonesToSend');
        await AsyncStorage.removeItem('distributionId');
        setOldStateDeleted('Old state deleted when start the service');
      } catch (error) {
        setOldStateDeleted('Failed to delete old state ' + error);
      }

      await startBackgroundUpdate();
      setIsChangingServiceStatus(true);
      setShowDevInfoModal(true);
    }

    checkStatusAsync();
  };

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
          <SliderMinMaxContainer>
            <StyledRangeText>1 h</StyledRangeText>
            <Filler />
            <StyledRangeText>12 h</StyledRangeText>
          </SliderMinMaxContainer>
        </SliderContainer>
        <StyleButton
          title={isTracking ? 'Stoppa körning' : 'Starta körning'}
          type="primary"
          onPress={() => {
            toggleLocationService();
          }}
          disabled={isChangingServiceStatus}
          isLoading={isChangingServiceStatus}
        />
      </Wrapper>
      {/* Remove modal after testing with Peter */}
      <StyledModal visible={showDevInfoModal}>
        <ModalBackDrop onPress={() => setShowDevInfoModal(false)} />
        <StyledModalChildContainer>
          <StyledOldState>{counter}</StyledOldState>
          <StyledOldState>{oldStateDeleted}</StyledOldState>

          <StyledServiceContainer>
            <StyledHeader>Service Status:</StyledHeader>
            <StyledServiceText>
              {isServiceClosed ? (
                <StyledServiceTextRed>Shutdown</StyledServiceTextRed>
              ) : isServiceCalled ? (
                'Running'
              ) : (
                'Waiting'
              )}
            </StyledServiceText>
          </StyledServiceContainer>
          <StyledUserLocationContainer>
            <StyledHeader>API call status:</StyledHeader>
            <StyledApiText>
              {apiCallStatus.length > 1 ? apiCallStatus : 'Waiting'}
            </StyledApiText>
          </StyledUserLocationContainer>

          <StyledUserLocationContainer>
            <StyledHeader>Distribution Zone:</StyledHeader>

            <StyledBody>
              Inside a distribution zone : {' ' + isInsideDistributionZone}
            </StyledBody>

            {distributionZone && (
              <StyledBody>
                Current Distribution Zone:{' '}
                {distributionZone
                  ? distributionZone.properties.name
                  : 'cannot get the name of zone'}
              </StyledBody>
            )}
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
          <StyledScrollView>
            {detailEventLog.map((event, index) => (
              <StyledCode key={index}>
                {'• '}
                {event}
              </StyledCode>
            ))}
          </StyledScrollView>
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

const SliderMinMaxContainer = styled.View`
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

const StyledCode = styled(Code)``;

const StyledOldState = styled(Body)`
  margin: 10px;
`;

const StyledServiceText = styled(Body)`
  color: green;
`;

const StyledServiceTextRed = styled(Body)`
  color: red;
`;
const StyledApiText = styled(Body)``;

//
const StyledModal = styled(Modal)``;

const StyledModalChildContainer = styled(ModalChildContainer)`
  padding: 20px;
  width: 100%;
`;

const StyledScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
}))`
  width: 100%;
  height: 200px;
  background-color: papayawhip;
  border-radius: 10px;
`;
