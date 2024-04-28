import { appConfig } from '@utils/app.config';
import log from '@utils/app.logger';

type Option<T> = { data?: T; error?: string };

export const TokenAccess = (baseUrl: string) => {
  const active = async (jwt: string): Promise<Option<{ active: boolean }>> => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${jwt}`);
      const response = await fetch(baseUrl + '/token/active', {
        method: 'GET',
        headers: myHeaders,
      });

      const result = await response.json();

      if (result.error) {
        log.info('UserAccess.login', 'friendlyError:', result.error);
        return { data: { active: false }, error: result.error };
      }

      if (!response.ok) {
        log.info('TokenAccess.active', 'unknown response error', result);
        return { data: { active: false }, error: 'unknown response error' };
      }

      return { data: { active: true } };
    } catch (error) {
      log.info('TokenAccess.active', 'error', error);
    }
    return { data: { active: false }, error: 'unknown error' };
  };

  return { active };
};

export const tokenAccess = TokenAccess(appConfig.url);
