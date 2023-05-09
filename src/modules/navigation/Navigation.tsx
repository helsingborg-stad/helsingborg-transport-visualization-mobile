import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import styled from 'styled-components/native';
import { AuthStack } from './AuthStack';
import { useAuthContext } from '@src/context/auth';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary.background};
`;

export const Navigation = () => {
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator
          size={60}
          color={`${({ theme }) => theme.colors.primary.main}`}
        />
      </Container>
    );
  }
  return (
    <NavigationContainer>
      {/* {!isLoggedIn ? <HomeStack /> : <AuthStack />} */}
      <AuthStack />
    </NavigationContainer>
  );
};