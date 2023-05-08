import { Platform } from 'react-native';
import {
  Roboto_400Regular as robotoRegular,
  Roboto_500Medium as robotoMedium,
  Roboto_700Bold as robotoSemiBold,
  Roboto_900Black as robotoBold,
} from '@expo-google-fonts/roboto';

export const customFontsToLoad = {
  robotoRegular,
  robotoMedium,
  robotoSemiBold,
  robotoBold,
};

const fonts = {
  roboto: {
    normal: 'robotoRegular',
    medium: 'robotoMedium',
    semiBold: 'robotoSemiBold',
    bold: 'robotoBold',
  },
  helveticaNeue: {
    // iOS only font.
    thin: 'HelveticaNeue-Thin',
    light: 'HelveticaNeue-Light',
    normal: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
  },
  courier: {
    // iOS only font.
    normal: 'Courier',
  },
  sansSerif: {
    // Android only font.
    thin: 'sans-serif-thin',
    light: 'sans-serif-light',
    normal: 'sans-serif',
    medium: 'sans-serif-medium',
  },
  monospace: {
    // Android only font.
    normal: 'monospace',
  },
};

export const typography = {
  fonts,
  primary: fonts.roboto,
  secondary: Platform.select({
    ios: fonts.helveticaNeue,
    android: fonts.sansSerif,
  }),
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
};
