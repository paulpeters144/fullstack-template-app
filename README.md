# fullstack-template-app

## API Folder Structure

├── src/
│ ├── app.ts
│ ├── lambda.ts
│ ├── controller/
│ │ ├── <controller>.ts

## SHARED Types & Interfaces

explain...

## Testing

### vitest

- vs vode, install Vitest & Vitest Runner

## Configure

for the backend, you'll need to add a env.config.ts file that configures the env for the app. Should look something like:

`import { Stage } from '@shared/types/shared.types';

export interface IAppConfig {
STAGE: string;
DDB_TABLE: string;
REGION: string;
ACCESS_TOKEN: string;
S3_BUCKET: string;
}

export const AppConfig = (env: Stage): IAppConfig => {
switch (env) {
case 'development':
return appConfigLocal();
case 'test':
return appConfigStaging();
case 'production':
throw new Error('production not implemented yet');
default:
throw new Error('NODE_ENV not found');
}
};

const appConfigLocal = (): IAppConfig => {
return {
STAGE: 'LOCAL',
DDB_TABLE: 'example-table',
REGION: 'us-east-1',
ACCESS_TOKEN: 'the-secret-key-for-the-jwt',
S3_BUCKET: 's3-bucket-name-local',
};
};

const appConfigStaging = (): IAppConfig => {
return {
STAGE: 'STAGING',
DDB_TABLE: 'example-table',
REGION: 'us-east-1',
ACCESS_TOKEN: 'the-secret-key-for-the-jwt',
S3_BUCKET: 's3-bucket-name-staging',
};
};`
