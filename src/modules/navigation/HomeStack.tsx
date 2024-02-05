import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@src/modules/home/screens';
import { GeolocationProvider } from '@src/context/geolocation/geolocationContext';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <GeolocationProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </GeolocationProvider>
  );
};
