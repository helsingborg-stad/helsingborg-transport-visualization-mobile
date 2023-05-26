import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import styled from 'styled-components/native';
import { AuthStack } from './AuthStack';
import { useAuthContext } from '@src/context/auth';
import { HomeStack } from './HomeStack';
import { useLocationPermission } from '@src/hooks/useLocationPermission';
import { PermissionNotGranted } from '@src/modules/permissionNotGranted/screens';
import { LocationBackgroundPermissionNeeded } from '../locationBackgroundPermissionNeeded/screens';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary.background};
`;

export const Navigation = () => {
  const { isLoading, isLoggedIn, isTokenExpired } = useAuthContext();
  const [locationBgPermissionStatus, setLocationBgPermissionStatus] =
    useState(false);
  const {
    isLocationPermissionGranted,
    isLocationPermissionDenied,
    isLocationBackgroundPermissionNeeded,
  } = useLocationPermission();

  if (!isLocationPermissionGranted) {
    return <PermissionNotGranted isDenied={isLocationPermissionDenied} />;
  }
  if (isLocationBackgroundPermissionNeeded && !locationBgPermissionStatus) {
    return (
      <LocationBackgroundPermissionNeeded
        setPermissionStatus={setLocationBgPermissionStatus}
      />
    );
  }

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
  console.log('----> log status', isLoggedIn, isTokenExpired);
  return (
    <NavigationContainer>
      {isLoggedIn && !isTokenExpired ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
