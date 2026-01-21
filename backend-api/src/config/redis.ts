import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const createRedisClient = () => {
  return createClient({
    url: `redis://${process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : ''}${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    database: parseInt(process.env.REDIS_DB || '0'),
  });
};

const initRedis = async () => {
  redisClient = createRedisClient() as RedisClientType;

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
