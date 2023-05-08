import React, { FC, useEffect, useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components';
import { Icon, Screen, Button, LargeTitle, Body } from '../components';

export const HomeScreen: FC = () => {
  const [shouldAppCrash, setShouldAppCrash] = useState<boolean>(false);

  const theme = useTheme();

  const featureList = [
    'Expo + Typescript',
    'Eslint & Prettier',
    'Styled Components',
    'Error boundry',
    'Theme (Color, margins, Font Sizes)',
    'Custom Fonts',
    'eas',
    'Axios',
    'Navigation',
    'React Query',
  ];

  const checkIcon = useMemo(
    () => <Feather name="check" size={24} color={theme.colors.primary.main} />,
    []
  );

  const todoIcon = useMemo(
    () => <Feather name="plus" size={24} color={theme.colors.primary.main} />,
    []
  );

  useEffect(() => {
    if (shouldAppCrash) {
      throw new Error('Oh! App crashed');
    }
  }, [shouldAppCrash]);

  const crashApp = () => {
    setShouldAppCrash(true);
  };

  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <StyledTitle>Helsingborg</StyledTitle>
      <StyledBody>
        Welcome to Helsingborg mobile app. This app have been made with expo
        including following features
      </StyledBody>
      <FeatureListContaier>
        {featureList.map((feature, index) => (
          <FeatureItemContainer key={feature}>
            {index <= 5 && <Icon icon={checkIcon} />}
            {index > 5 && <Icon icon={todoIcon} />}
            <StyledBody>{feature}</StyledBody>
          </FeatureItemContainer>
        ))}
      </FeatureListContaier>
      <StyledBodyCrashText>
        To check the Error screen press the button below
      </StyledBodyCrashText>

      <StyleButton title={'Click to Crash the app'} onPress={crashApp} />
    </StyledScreen>
  );
};
const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
}))``;

const StyledTitle = styled(LargeTitle)`
  color: ${({ theme }) => theme.colors.primary.main};
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const StyledBody = styled(Body)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const StyledBodyCrashText = styled(StyledBody)`
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const FeatureListContaier = styled.View`
  width: 100%;
  padding: ${({ theme }) => `${theme.space.xxs} 0`};
`;

const FeatureItemContainer = styled.View`
  width: 100%;
  padding: ${({ theme }) => `0 ${theme.space.md}`};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const StyleButton = styled(Button)`
  margin: ${({ theme }) => `${theme.space.lg} 0px`};
`;
