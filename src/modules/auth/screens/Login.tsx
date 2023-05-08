import React, { FC } from 'react';
import styled from 'styled-components/native';
// import { useTheme } from 'styled-components';
import { Screen, Button, LargeTitle, Body } from '@src/components';
import { useLogin } from '@src/modules/auth/hooks/useLogin';

export const LoginScreen: FC = () => {
  // const theme = useTheme();

  const { login, isLoading } = useLogin({
    onSuccess: () => console.log('On Success Called'),
    onError: () => console.log('On Error Called'),
  });

  const handleLogin = () => {
    //
    login({
      email: 'me',
      password: 'me',
    });
  };

  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <StyledTitle>Login</StyledTitle>
      <StyledBody>
        Click the button below to Dummy Login - {isLoading}
      </StyledBody>

      <StyleButton title={'Click to Crash the app'} onPress={handleLogin} />
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
  margin: ${({ theme }) => `${theme.space.sm} 0 ${theme.space.xl} 0`};
`;

const StyleButton = styled(Button)`
  margin: ${({ theme }) => `${theme.space.lg} 0px`};
`;
