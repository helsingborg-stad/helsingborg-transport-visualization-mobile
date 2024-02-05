import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'helsingborg-app',
  name: 'Sam',
  android: {
    ...config.android,
    config: {
      ...config.android.config,
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
      },
    },
  },
  ios: {
    ...config.ios,
    config: {
      ...config.ios.config,
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
    },
  },
  extra: {
    eas: {
      projectId: '66d00a50-a329-4419-b6b6-b59557721210',
    },
  },
});
