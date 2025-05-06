import { GetParameterCommand } from '@aws-sdk/client-ssm';

import { ssmClient } from '@/lib/aws';

const cache: Record<string, string> = {};

export async function getSecret(name: string): Promise<string> {
  if (cache[name]) {
    return cache[name];
  }

  const cmd = new GetParameterCommand({
    Name: name,
    WithDecryption: true,
  });
  const resp = await ssmClient.send(cmd);
  if (!resp.Parameter?.Value) {
    throw new Error(`Parameter ${name} has no value`);
  }

  cache[name] = resp.Parameter.Value;
  return resp.Parameter.Value;
}
