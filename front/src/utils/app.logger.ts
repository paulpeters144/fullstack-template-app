import { appConfig } from './app.config';

const logger = () => {
  const info = (message?: any, ...optionalParams: any[]) => {
    if (appConfig.stage === 'production') return;

    console.log(message, ...optionalParams);
  };

  const warn = (message?: any, ...optionalParams: any[]) => {
    if (appConfig.stage === 'production') return;

    console.warn(message, ...optionalParams);
  };

  const error = (message?: any, ...optionalParams: any[]) => {
    if (appConfig.stage === 'production') return;

    console.error(message, ...optionalParams);
  };

  const debug = (message?: any, ...optionalParams: any[]) => {
    if (appConfig.stage === 'production') return;

    console.debug(message, ...optionalParams);
  };

  return { info, warn, error, debug };
};

const log = logger();

export default log;
