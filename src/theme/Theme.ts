import { typography } from './Typography';

// COLORS
const PRIMARY_MAIN = '#000000';
const PRIMARY_DARK = '#224E80';
const PRIMARY_BLUE_BLACK = '#0B1B2D';
const PRIMARY_LIGHT = '#4F86C9';
const PRIMARY_BACKGROUND = '#F5F5F5;';
const PRIMARY_BACKGROUND_HIGHLIGHT = '#e5e5e5';
const PRIMARY_HOVER = '#0A2756';
const PRIMARY_BORDER_COLOR = '#A3A3A3';
const SECONDARY_MAIN = '#FCC91C';
const TEXT_PRIMARY = '#000';
const TEXT_SECONDARY = 'rgba(0, 0, 0, 0.6)';
const TEXT_DISABLED = 'rgba(0, 0, 0, 0.38)';
const SUCCESS_MAIN = '#4CAF50';
const ERROR_MAIN = '#CC0000';
const WARNING_LIGHT = '#FFB547';
const WARNING_MAIN = '#F29102';
const INFO_MAIN = '#4F86C9';

const theme = {
  space: {
    xxs: '4px',
    xs: '6px',
    sm: '8px',
    md: '16px',
    lg: '22px',
    xl: '30px',
    xxl: '64px',
  },
  colors: {
    black: '#000',
    white: '#fff',
    primary: {
      main: PRIMARY_MAIN,
      dark: PRIMARY_DARK,
      darkSecondary: PRIMARY_BLUE_BLACK,
      light: PRIMARY_LIGHT,
      hover: PRIMARY_HOVER,
      background: PRIMARY_BACKGROUND,
      backgroundHighlight: PRIMARY_BACKGROUND_HIGHLIGHT,
      borderColor: PRIMARY_BORDER_COLOR,
    },
    secondary: { main: SECONDARY_MAIN },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: TEXT_DISABLED,
      dimText: '#564E4A',
    },
    state: {
      success: SUCCESS_MAIN,
      error: ERROR_MAIN,
      warning: WARNING_LIGHT,
      warningMain: WARNING_MAIN,
      info: INFO_MAIN,
    },
    snackbar: {
      green: '#239F3E',
      red: '#DB3348',
    },
    grey: {
      '100': '#F4F7F8',
      '200': '#EAEFF1',
      '250': '#D1D1D1',
      '300': '#CDD3D7',
      '400': '#18181A66',
      '450': '#A3A3A3',
      '500': '#71767A',
      '600': '#747476',
      '650': '#1F1C32',
      '700': '#384657',
      '800': '#464648',
      '900': '#15223A',
    },
  },
  fontSizes: {
    xxl: '36px',
    xl: '24px',
    lg: '20px',
    md: '18px',
    sm: '16px',
    xs: '14px',
    xxs: '12px',
  },
  fonts: {
    regular: typography.primary.normal,
    medium: typography.primary.medium,
    semibold: typography.primary.semiBold,
    bold: typography.primary.bold,
    // Just in case we need other varients
    primary: typography.primary,
    secondary: typography.secondary,
    code: typography.code,
  },
  fontWeights: {
    bold: 600,
    normal: 400,
  },
  lineHeights: {
    xxl: '44px',
    xl: '34px',
    lg: '32px',
    md: '26px',
    sm: '24px',
    xs: '21px',
    xxs: '18px',
  },
  letterSpaces: {
    xs: '-3px',
    sm: '0.4px',
    md: '0.5px',
    lg: '0.8px',
    no: '0px',
  },
  shadows: {
    main: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)',
    light:
      '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
};

export default theme;

export type ThemeType = typeof theme;
