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
            <StyledTitle>Hoppsan!</StyledTitle>
            <ErrorText>
              Platsinfo behöver vara aktiverad för att Sam ska fungera.
            </ErrorText>
            <ErrorText>
              Klicka på knappen för att tillåta plastinfo i inställningar.
            </ErrorText>
            <StyleButton
              title={'Tillåt åtkomst till platsinfo'}
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

const StyleButton = styled(Button)`
  margin: ${({ theme }) => `${theme.space.xxl} 0px ${theme.space.lg} 0px`};
  align-self: center;
  width: 100%;
`;
