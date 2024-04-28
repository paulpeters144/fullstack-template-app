import { Stage } from '@shared/types/shared.types';

const AppConfig = () => {
  const url: string = process.env.EXPO_PUBLIC_API_URL!;
  const stage: Stage = (process.env.EXPO_PUBLIC_STAGE as Stage) || 'development';
  return {
    url,
    stage,
  };
};

const c = AppConfig();
export const appConfig = c;
