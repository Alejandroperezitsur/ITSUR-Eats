import 'dotenv/config';
import { EventProcessorWorker } from './workers/eventProcessor.worker';
import { prisma } from './config/prisma';
import { redis } from './config/redis';

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Shutting down worker...');
  await prisma.$disconnect();
  const redisClient = await redis;
  if (redisClient) await redisClient.quit();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('� Starting Event Processor Worker...');
const worker = new EventProcessorWorker();
worker.start();
