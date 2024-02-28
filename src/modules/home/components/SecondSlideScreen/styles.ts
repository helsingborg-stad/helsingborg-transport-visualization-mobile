import styled from 'styled-components/native';
import { Body, Screen, SubTitle } from '@src/components';
import { View } from 'react-native';

export const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    flex: 1,
    padding: 22,
    marginBottom: 32,
  },
}))``;

export const ListItem = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  flex-direction: row;
  gap: ${({ theme }) => theme.space.lg};
`;

export const Circle = styled.View`
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  border-radius: 50px;
  padding: 10px;
  align-items: center;
  justify-content: center;
`;

export const StyledSubtitle = styled(SubTitle)`
  color: #3d3d3d;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const StyledBody = styled(Body)`
  color: #707070;
  font-family: ${({ theme }) => theme.fonts.semibold};
`;

export const CenterView = styled(View)`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  gap: ${({ theme }) => theme.space.lg};
`;

export const NoResultTitle = styled(SubTitle)`
  text-align: center;
`;
