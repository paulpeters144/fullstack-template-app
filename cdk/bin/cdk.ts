import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { CdkStack } from '../lib/cdk-stack';

export interface IStagingContext {
  stage: string;
}

const app = new cdk.App();

const stage = app.node.tryGetContext('stage') as string;
const contenxt = app.node.tryGetContext(stage) as IStagingContext;

if (!contenxt || !contenxt.stage) {
  throw new Error('stage context or env is not set');
}

if (contenxt.stage !== 'test' && contenxt.stage !== 'production') {
  throw new Error('stage needs to be either test or production');
}

const stackName = `fullstack-template-app-${contenxt.stage}`;

new CdkStack(app, stackName, {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
  stackName: stackName,
  tags: { stage: contenxt.stage },
});
