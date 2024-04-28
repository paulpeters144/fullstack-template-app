import { describe, expect, it } from 'vitest';

import { UserAccess } from '@access/user.access';
import { TokenAccess } from '@access/token.access';

const URL = 'https://3xa1mb6zq9.execute-api.us-east-1.amazonaws.com/prod';
const JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhdWwucGV0ZXJzMTQ0' +
  'QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMTI3OTM3MCwiZXhwIjoxN' +
  'zExNjI0OTcwfQ.o8f4_5ULB5vzrKExY6KDKqYRMSjt4v1VybDnjLpp_Tc';

describe('#Access what the what what what', () => {
  it('access to get a user', async () => {
    const access = UserAccess(URL);
    const res = await access.login({
      email: 'paul.peters144@gmail.com',
      password: 'password1234',
    });
    expect(res.data?.accessToken).toBeTruthy();
  });

  it('get an invalid password', async () => {
    const access = UserAccess(URL);
    const res = await access.login({
      email: 'paul.peters144@gmail.com',
      password: 'password123',
    });
    expect(res.error).toBeTruthy();
  });

  it('should get jwt status', async () => {
    const access = TokenAccess(URL);
    const res = await access.active(JWT);
    expect(res.data).toBe(true);
  });
});
