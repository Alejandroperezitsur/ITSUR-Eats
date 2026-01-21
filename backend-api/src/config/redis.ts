import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

const initRedis = async () => {
  redisClient = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
  } as any);

  redisClient.on('error', (err: Error) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis Client Connected');
  });

  await redisClient.connect();
  return redisClient;
};

export const redis = initRedis().catch((err) => {
  console.error('Failed to initialize Redis:', err);
  return null;
});

export default redis;
