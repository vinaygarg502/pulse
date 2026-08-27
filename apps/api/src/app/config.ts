import dotenv from 'dotenv';
type NodeEnv = 'development' | 'production' | 'test';

interface Config {
  port: Number;
  nodeEnv: NodeEnv;
}

dotenv.config();
const nodeEnv = process.env.NODE_ENV;

if (nodeEnv !== 'development' && nodeEnv !== 'production' && nodeEnv !== 'test') {
  throw new Error('Invalid NODE_ENV');
}
export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv,
};
