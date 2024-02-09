import React from 'react';
import styled from 'styled-components/native';
import { Screen, LargeTitle, Body, Button } from '@src/components';
import * as Location from 'expo-location';

type Props = {
  setPermissionStatus: (val: boolean) => void;
};

export const LocationBackgroundPermissionNeeded: React.FC<Props> = ({
  setPermissionStatus,
}) => {
  const handlePermission = async () => {
    const status = await Location.requestBackgroundPermissionsAsync();
    console.log('status bg location', status);
    if (status.granted) {
      setPermissionStatus(true);
    }
  };
  return (
    <StyledScreen>
      <Wrapper>
        <ErrorContainer>
          <StyledTitle>Ge appen platsåtkomst</StyledTitle>
          <ErrorText>
            För att Sam ska kunna spåra din plats behöver du aktivera
            alternativet <ErrorTextBold>"Tillåt alltid"</ErrorTextBold> i
            inställningar.
          </ErrorText>
          <StyleButton
            title={'“Tillåt alltid” i inställningar'}
            onPress={handlePermission}
            type="primary"
          />
        </ErrorContainer>
      </Wrapper>
    </StyledScreen>
  );
};

const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
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

const ErrorContainer = styled(Wrapper)`
  width: 100%;
  align-items: flex-start;
`;

const StyledTitle = styled(LargeTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0 `};
  align-self: flex-start;
`;

const ErrorText = styled(Body)`
  margin-top: ${({ theme }) => theme.space.sm};
`;

const ErrorTextBold = styled(Body)`
  font-weight: 700;
`;

const StyleButton = styled(Button)`
  margin: ${({ theme }) => `${theme.space.xxl} 0px ${theme.space.lg} 0px`};
  align-self: center;
  width: 100%;
`;
