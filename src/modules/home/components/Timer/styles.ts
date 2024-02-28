import styled from 'styled-components/native';
import { Body, LargeTitle, SubTitle } from '@src/components';
import { Platform } from 'react-native';
import Slider from '@react-native-community/slider';

export const StyledSubTitle = styled(SubTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

export const TimerContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.xxl}`};
  border-radius: 15px;
  margin: 10px;
  align-items: center;
  gap: 8px;
`;

export const StyledTimerText = styled(LargeTitle)``;

export const StyledBodyText = styled(Body)`
  color: #e1e1e1;
`;
export const StyledRangeText = styled(Body)`
  color: ${({ theme }) => theme.colors.primary.borderColor};
`;

export const SliderContainer = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.space.xxl};
  padding: ${({ theme }) => `0 ${theme.space.lg}`};
  justify-content: center;
  align-items: center;
`;

export const SliderMinMaxContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) =>
    `0 ${Platform.OS !== 'ios' ? theme.space.md : '0px'}`};
`;

export const Filler = styled.View`
  flex: 1;
  height: 0;
`;

export const StyledSlider = styled(Slider)`
  width: 100%;
  height: 40px;
`;
