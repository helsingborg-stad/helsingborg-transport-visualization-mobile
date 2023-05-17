import { ActivityIndicator } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled, { ThemeProvider } from 'styled-components/native';
import { customFontsToLoad } from '@src/theme';
import { ErrorBoundary } from '@src/modules/errorBoundary';
import theme from '@src/theme/Theme';
import { Navigation } from '@src/modules/navigation';
import AuthProvider from '@src/context/auth/AuthState';
import '@src/taskManager/TaskManager';
const queryClient = new QueryClient();

export default function App() {
  const [areFontsLoaded] = useFonts(customFontsToLoad);

  // Wait until our fonts are loaded
  // We should add a proper screen or extend the Splash Screen
  // for this purpise
  if (!areFontsLoaded)
    return (
      <Container>
        <ActivityIndicator size={60} color={`${theme.colors.primary.main}`} />
      </Container>
    );

  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <ErrorBoundary catchErrors={'always'}>
              <StatusBar style="light" translucent />
              <Navigation />
            </ErrorBoundary>
          </ThemeProvider>
        </QueryClientProvider>
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
