import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { SubTitle, Screen, LargeTitle, Body, Button } from '@src/components';
import Slider from '@react-native-community/slider';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { useAuthContext } from '@src/context/auth';
import { useGetTrackingTimeText } from '../hooks/useGetTrackingTimeText';
import { useGetAllZones } from '@src/modules/zone/hooks/useGetAllZones';
import * as turf from '@turf/turf';

export const HomeScreen: FC = () => {
  const { logout } = useAuthContext();
  const theme = useTheme();
  //State
  const [hoursToTrack, setHoursToTrack] = useState(8);
  const [isTracking, setIsTracking] = useState(false);

  //Hooks
  const { currentStopTrackingTime, timeLeft } =
    useGetTrackingTimeText(hoursToTrack);

  //Get All getAllZones
  const { zones } = useGetAllZones();

  useEffect(() => {
    if (!zones) {
      console.log('zones not ready yet');
      return;
    }

    const pt = turf.point([12.730018737, 56.025278798]);
    const features = zones.features;
    features.forEach((zone, index) => {
      const poly = zone;
      const isInsideZone = turf.booleanPointInPolygon(pt, poly);
      if (isInsideZone) {
        console.log('User location is in this zone', index, zone);
      }
    });
  }, [zones]);

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
