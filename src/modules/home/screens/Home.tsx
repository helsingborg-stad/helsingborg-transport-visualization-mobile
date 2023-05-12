import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { SubTitle, Screen, LargeTitle, Body, Button } from '@src/components';
import Slider from '@react-native-community/slider';
// import { useAuthContext } from '@src/context/auth';

export const HomeScreen: FC = () => {
  // const { logout } = useAuthContext();
  const [isTracking, setIsTracking] = useState(false);

  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Wrapper>
        <StyledSubTitle>Automatisk stopptid</StyledSubTitle>
        <TimerContainer>
          <StyledTimerText>14:05</StyledTimerText>
        </TimerContainer>
        <StyledBodyText>om 3 tim 20 min</StyledBodyText>
        <SliderContainer>
          <Slider
            style={{ width: 300, height: 20 }}
            minimumValue={0}
            maximumValue={12}
            value={8}
            minimumTrackTintColor="#2E2E2E"
            maximumTrackTintColor="rgba(120, 120, 128, 0.36)"
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
          onPress={() => setIsTracking((v) => !v)}
          // onPress={() => logout()}
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
  margin-top: ${({ theme }) => theme.space.xxl};
`;

const SliderMinMaxContiner = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
