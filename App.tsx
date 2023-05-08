import { Text } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ThemeProvider } from 'styled-components/native';
import { customFontsToLoad } from './src/theme';
import { HomeScreen } from './src/screens/Home';
import { ErrorBoundary } from './src/screens/ErrorScreen/ErrorBoundary';
import theme from './src/theme/Theme';

export default function App() {
  const [areFontsLoaded] = useFonts(customFontsToLoad);

  //Wait until our fonts are loaded
  if (!areFontsLoaded) return <Text>Loading</Text>;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary catchErrors={'always'}>
          {/* 
          We will add our main navigator and replace the <HomeScreen />
          For now it will just open one page
        */}
          <HomeScreen />
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
