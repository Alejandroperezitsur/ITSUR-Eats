import { Server, ServerOptions } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import { createRedisClient } from './redis';
import { Express } from 'express';

let io: Server;

export const initializeSocketIO = async (httpServer: HttpServer) => {
  const socketOptions: Partial<ServerOptions> = {
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingInterval: 10000,
    pingTimeout: 5000,
  };

  // Redis Adapter Setup for Horizontal Scaling
  if (process.env.REDIS_HOST) {
    const pubClient = createRedisClient();
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    socketOptions.adapter = createAdapter(pubClient, subClient);
    console.log('✅ Socket.IO Redis Adapter configured');
  }

  io = new Server(httpServer, socketOptions);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user to their own room for targeted notifications
    if (socket.handshake.auth.userId) {
        socket.join(`user:${socket.handshake.auth.userId}`);
        console.log(`User joined room: user:${socket.handshake.auth.userId}`);
    }

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Export singleton instance getter (might be undefined before initialization)
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

// For backward compatibility if needed, but preferable to use getIO()
export { io };
