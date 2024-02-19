import { TouchableWithoutFeedback } from 'react-native';
import React, { FC } from 'react';
import { useTheme } from 'styled-components';
import {
  Filler,
  SliderContainer,
  SliderMinMaxContainer,
  StyledBodyText,
  StyledRangeText,
  StyledSlider,
  StyledSubTitle,
  StyledTimerText,
  TimerContainer,
} from './styles';

interface TimerProps {
  showDebugModal: () => void;
  currentStopTrackingTime: string;
  timeLeft: string;
  hoursToTrack: number;
  onSliderChange: (value: number) => void;
}

export const Timer: FC<TimerProps> = ({
  showDebugModal,
  currentStopTrackingTime,
  timeLeft,
  hoursToTrack,
  onSliderChange,
}) => {
  const theme = useTheme();

  return (
    <>
      <TouchableWithoutFeedback onPress={showDebugModal}>
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
          onValueChange={onSliderChange}
          step={1}
        />
        <SliderMinMaxContainer>
          <StyledRangeText>1 h</StyledRangeText>
          <Filler />
          <StyledRangeText>12 h</StyledRangeText>
        </SliderMinMaxContainer>
      </SliderContainer>
    </>
  );
};
