import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { SubTitle, Screen, LargeTitle, Body, Button } from '@src/components';
import Slider from '@react-native-community/slider';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { useAuthContext } from '@src/context/auth';

export const HomeScreen: FC = () => {
  const { logout } = useAuthContext();
  const [isTracking, setIsTracking] = useState(false);
  const [currentStopTrackingTime, setCurrentStopTrackingTime] = useState('');
  const [hoursToTrack, setHoursToTrack] = useState(8);
  const [timeLeft, setTimeLeft] = useState('');
  const [endTime, setEndTime] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const StopTimeForamated = calculateHoursToStopTracking(hoursToTrack);
    setCurrentStopTrackingTime(StopTimeForamated);
  }, [hoursToTrack]);

  //Get Time Remaining
  useEffect(() => {
    const today = new Date();
    const timeLeft = getTimeDifference(today, endTime);
    setTimeLeft(timeLeft);
  }, [endTime]);

  //Set an interval to auto calculate the time remaning
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const timeLeft = getTimeDifference(today, endTime);
      setTimeLeft(timeLeft);
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const calculateHoursToStopTracking = (hours: number) => {
    const hoursToAdd = 1000 * 60 * 60 * hours;
    const today = new Date();
    const stopTime = new Date(today.getTime() + hoursToAdd);

    let StopTimeForamated = stopTime.toLocaleString([], {
      hour12: false,
    });
    StopTimeForamated = StopTimeForamated.slice(12).slice(0, -3);
    setEndTime(stopTime);
    return StopTimeForamated;
  };

  const getTimeDifference = (startTime, endTime) => {
    const difference = endTime - startTime;
    const differenceInMinutes = difference / 1000 / 60;
    let hours = Math.floor(differenceInMinutes / 60);
    if (hours < 0) {
      hours = 24 + hours;
    }
    let minutes = Math.floor(differenceInMinutes % 60);
    if (minutes < 0) {
      minutes = 60 + minutes;
    }
    const hoursAndMinutes = `om ${hours} tim ${
      (minutes < 10 ? '0' : '') + minutes
    } min`;
    return hoursAndMinutes;
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
            // style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={12}
            value={8}
            thumbTintColor={theme.colors.primary.main}
            minimumTrackTintColor={theme.colors.primary.main}
            maximumTrackTintColor={theme.colors.primary.backgroundHighlight}
            onValueChange={(val) => setHoursToTrack(val)}
            step={1}
          />
          <SliderMinMaxContiner>
            <StyledRangeText>0 h</StyledRangeText>
            <Filler />
            <StyledRangeText>12 h</StyledRangeText>
          </SliderMinMaxContiner>
        </SliderContainer>
        <StyleButton
          title={isTracking ? 'Starta körning' : 'Stoppa körning'}
          type="primary"
          onPress={() => {
            logout();
            setIsTracking((v) => !v);
          }}
        />
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
