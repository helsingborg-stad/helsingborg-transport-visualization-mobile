import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const ENV = {
  dev: {
    apiUrl: process.env.API_URL,
    easProjectID: process.env.EAS_PROJECT_ID,
  },
  staging: {
    apiUrl: process.env.API_URL_STAGING,
    easProjectID: process.env.EAS_PROJECT_ID,
  },
  production: {
    apiUrl: process.env.API_URL_PRODUCTION,
    easProjectID: process.env.EAS_PROJECT_ID,
  },
};

const getEnvVars = (env = process.env.APP_ENV) => {
  if (env === 'production') {
    return ENV.production;
  }
  if (env === 'staging') {
    return ENV.staging;
  }

  return ENV.dev;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'HelsingborgApp',
  name: 'helsingborg-app',
  extra: {
    eas: {
      projectId: getEnvVars().easProjectID,
    },
    API_URL: getEnvVars().apiUrl,
  },
});
