import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import {
  Body,
  Button,
  LargeTitle,
  Screen,
  SubTitle,
  Title,
} from '@src/components';
import Slider from '@react-native-community/slider';
import { useTheme } from 'styled-components';
import { Platform, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '@src/context/auth';
import { useGetTrackingTimeText } from '../hooks/useGetTrackingTimeText';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK_NAME } from '@src/utils/Constants';
import { DebugModal } from '../components/DebugModal';
import Map from '@src/modules/home/components/Map/Map';
import { useGeolocationContext } from '@src/context/geolocation/geolocationContext';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const HomeScreen: FC = () => {
  const { logout } = useAuthContext();
  const theme = useTheme();
  //State
  const [hoursToTrack, setHoursToTrack] = useState(8);
  const [isTracking, setIsTracking] = useState(false);
  const [isChangingServiceStatus, setIsChangingServiceStatus] = useState(false);
  const [showDevInfoModal, setShowDevInfoModal] = useState(false);
  const [oldStateDeleted, setOldStateDeleted] = useState('');
  const [tapCount, setTapCount] = useState(0);

  //Hooks
  const { currentStopTrackingTime, timeLeft } = useGetTrackingTimeText(
    hoursToTrack,
    isTracking
  );

  const handleTripleTap = () => {
    setTapCount(tapCount + 1);

    if (tapCount === 2) {
      // Reset tap count after triple tap
      setTapCount(0);

      // Show the debug modal
      setShowDevInfoModal(true);
    }
  };

  const {
    isServiceClosed,
    isServiceCalled,
    location,
    apiCallStatus,
    userZones,
    distributionZone,
    isInsideDistributionZone,
    detailEventLog,
    stopLocationUpdates,
    startLocationUpdates,
    serviceStatus,
  } = useGeolocationContext();

  // Use Effects
  useEffect(() => {
    const checkServiceStatus = async () => {
      const { isRegistered, status } = await checkStatusAsync();
      //if service is not registered yet and it is available we start on load
      //other wise service is already running so we update the local state
      if (!isRegistered && status?.toLowerCase() === 'available') {
        try {
          await AsyncStorage.removeItem('zonesToSend');
          await AsyncStorage.removeItem('recordedLocations');
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
      setIsChangingServiceStatus(true);
      setIsTracking(false);
      logout();
    } else {
      //we reset the local state every time we start the service
      try {
        await AsyncStorage.removeItem('zonesToSend');
        await AsyncStorage.removeItem('recordedLocations');
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

  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Map />
      <Wrapper>
        {userZones && userZones.length > 0 ? (
          <>
            <TouchableWithoutFeedback onPress={handleTripleTap}>
              <StyledSubTitle>Inom spårningsområde</StyledSubTitle>
            </TouchableWithoutFeedback>
            <StyledScrollView>
              {userZones.map((zone) => (
                <ZoneContainer key={zone.properties.id}>
                  <Title>{zone.properties.name}</Title>
                  <Body>{zone.properties.address}</Body>
                </ZoneContainer>
              ))}
            </StyledScrollView>
          </>
        ) : (
          <>
            <TouchableWithoutFeedback onPress={handleTripleTap}>
              <StyledSubTitle>Automatisk stopptid</StyledSubTitle>
            </TouchableWithoutFeedback>
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
          </>
        )}
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
}))``;

const Wrapper = styled.View`
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 22px;
  padding-bottom: 22px;
`;

const StyledSubTitle = styled(SubTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const TimerContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.xxl}`};
  border-radius: 15px;
  margin: 10px;
  align-items: center;
  gap: 8px;
`;

const ZoneContainer = styled.View`
  align-items: center;
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
  margin-top: ${({ theme }) => theme.space.xl};
  align-self: center;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  height: 40px;
`;

const StyledScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
}))`
  max-height: 150px;
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.xxl}`};
  border-radius: 15px;
  margin: 10px;
`;
