import { ActivityIndicator } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import styled, { ThemeProvider } from 'styled-components/native';
import { customFontsToLoad } from './src/theme';
import { ErrorBoundary } from './src/modules/errorBoundary';
import theme from './src/theme/Theme';
import { Navigation } from './src/modules/navigation';

export default function App() {
  const [areFontsLoaded] = useFonts(customFontsToLoad);

  //Wait until our fonts are loaded
  if (!areFontsLoaded)
    return (
      <Container>
        <ActivityIndicator size={60} color={`${theme.colors.primary.main}`} />
      </Container>
    );

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary catchErrors={'always'}>
          <Navigation />
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.primary.background};
`;
