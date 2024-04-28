import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IAppConfig } from '@src/config/env.config';

export interface IS3Access {
  get(): Promise<void>;
}

export const S3Access = (config: IAppConfig): IS3Access => {
  const _bucket: string = config.S3_BUCKET;
  const _client: S3Client = new S3Client();

  const get = async (): Promise<void> => {
    const command = new GetObjectCommand({
      Bucket: _bucket,
      Key: 'sample.json',
    });
    const response = await _client.send(command);
    const file = await response.Body?.transformToString();
    if (file) {
      const data = JSON.parse(file);
      console.log(data);
      console.log('file', file);
    }
  };

  return { get };
};
