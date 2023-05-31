import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { SubTitle, Screen, LargeTitle, Body, Button } from '@src/components';

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
import { DebugModal } from '../components/DebugModal';

//
//
//
export const HomeScreen: FC = () => {
  const { logout } = useAuthContext();
  const theme = useTheme();
  //State
  const [hoursToTrack, setHoursToTrack] = useState(8);
  const [isTracking, setIsTracking] = useState(false);
  const [isChangingServiceStatus, setIsChangingServiceStatus] = useState(false);
  const [showDevInfoModal, setShowDevInfoModal] = useState(false);
  const [oldStateDeleted, setOldStateDeleted] = useState('');
  // const [counter, setCounter] = useState(0);

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
    const checkServiceStatus = async () => {
      const { isRegistered, status } = await checkStatusAsync();
      //if service is not registered yet and it is available we start on load
      //other wise service is already running so we update the local state
      if (!isRegistered && status?.toLowerCase() === 'available') {
        try {
          await AsyncStorage.removeItem('zonesToSend');
          await AsyncStorage.removeItem('distributionId');
          setOldStateDeleted('Old state deleted when start the service');
        } catch (error) {
          setOldStateDeleted('Failed to delete old state ' + error);
        }
        await startBackgroundUpdate();
        setIsChangingServiceStatus(false);
        setShowDevInfoModal(true);
        setIsTracking(true);
      } else {
        setIsTracking(true);
        setIsChangingServiceStatus(false);
        setShowDevInfoModal(true);
      }
    };
    checkServiceStatus();
  }, []);

  //When location is available we start execute the task
  useEffect(() => {
    if (userLocation) {
      EventTask(userLocation);
    }
  }, [userLocation]);

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

  //Functions
  const toggleLocationService = async () => {
    if (isTracking) {
      await stopBackgroundUpdate();
      setIsChangingServiceStatus(true);
      setIsTracking(false);
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
      setIsTracking(true);
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
    return {
      isRegistered,
      status: BackgroundFetch.BackgroundFetchStatus[status],
    };
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
      {/* Modal to show debug info */}
      <DebugModal
        isServiceClosed={isServiceClosed}
        isServiceCalled={isServiceCalled}
        apiCallStatus={apiCallStatus}
        isInsideDistributionZone={isInsideDistributionZone}
        distributionZone={distributionZone}
        location={location}
        userZones={userZones}
        detailEventLog={detailEventLog}
        showDevInfoModal={showDevInfoModal}
        setShowDevInfoModal={setShowDevInfoModal}
        oldStateDeleted={oldStateDeleted}
      />
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
