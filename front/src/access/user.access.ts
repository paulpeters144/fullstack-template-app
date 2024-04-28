import { SI, ST } from '@shared/types';
import { appConfig } from '@utils/app.config';
import log from '@utils/app.logger';

type Option<T> = { data?: T; error?: string };

export const UserAccess = (baseUrl: string) => {
  const login = async (
    credentials: ST.LoginRequest,
  ): Promise<Option<SI.IAccessToken>> => {
    try {
      const response = await fetch(baseUrl + '/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.error) {
        log.info('UserAccess.login', 'friendlyError:', result.error);
        return { error: result.error };
      }

      if (!response.ok) {
        log.info('UserAccess.login', 'unknown response error', result);
        return { error: 'unknown response error' };
      }

      return { data: result };
    } catch (error) {
      log.info('UserAccess', 'error', error);
    }
    return { error: 'unknown error' };
  };

  return { login };
};

export const userAccess = UserAccess(appConfig.url);
