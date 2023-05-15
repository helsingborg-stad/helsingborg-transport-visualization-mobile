import React from 'react';
import styled from 'styled-components/native';
import { Linking } from 'react-native';
import {
  Screen,
  LargeTitle,
  Body,
  Button,
  ActivityIndicator,
} from '@src/components';

type PermissionNotGrantedProps = {
  isDenied: boolean;
};

export const PermissionNotGranted: React.FC<PermissionNotGrantedProps> = ({
  isDenied,
}) => {
  return (
    <StyledScreen>
      <Wrapper>
        {!isDenied && <ActivityIndicator size={'large'} />}
        {isDenied && (
          <ErrorContainer>
            <StyledTitle>Oops ⚠️</StyledTitle>
            <ErrorText>
              Location permission is required to use the app. Please allow it
              before continuing.
            </ErrorText>
            <ErrorText>
              You have to grant permission from settings page. Please click the
              button below to do so
            </ErrorText>
            <StyleButton
              title={'Grant Permission through settings'}
              onPress={() => {
                Linking.openSettings();
              }}
              type="primary"
            />
          </ErrorContainer>
        )}
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

const ErrorContainer = styled(Wrapper)`
  width: 100%;
  height: 40%;
`;

const StyledTitle = styled(LargeTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0 ${theme.space.xxl} 0`};
  align-self: flex-start;
`;

const ErrorText = styled(Body)`
  margin-top: ${({ theme }) => theme.space.sm};
`;

const StyleButton = styled(Button)`
  margin: ${({ theme }) => `${theme.space.xxl} 0px ${theme.space.lg} 0px`};
  align-self: center;
`;
