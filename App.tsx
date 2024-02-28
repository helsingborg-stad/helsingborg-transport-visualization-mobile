import { ActivityIndicator } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import styled, { ThemeProvider } from 'styled-components/native';
import { customFontsToLoad } from '@src/theme';
import { ErrorBoundary } from '@src/modules/errorBoundary';
import theme from '@src/theme/Theme';
import { Navigation } from '@src/modules/navigation';
import AuthProvider from '@src/context/auth/AuthState';

export default function App() {
  const [areFontsLoaded] = useFonts(customFontsToLoad);

  // Wait until our fonts are loaded
  // We should add a proper screen or extend the Splash Screen
  // for this purpose
  if (!areFontsLoaded)
    return (
      <Container>
        <ActivityIndicator size={60} color={`${theme.colors.primary.main}`} />
      </Container>
    );

  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary catchErrors={'always'}>
            <StatusBar style="light" translucent />
            <Navigation />
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.primary.background};
`;
