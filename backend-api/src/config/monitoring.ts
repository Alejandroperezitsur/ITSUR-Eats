import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'itsur-eats-backend',
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Define custom metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});

export const activeSocketConnections = new client.Gauge({
  name: 'active_socket_connections',
  help: 'Number of active Socket.IO connections',
});

export const orderCreationCounter = new client.Counter({
  name: 'order_creation_total',
  help: 'Total number of orders created',
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(activeSocketConnections);
register.registerMetric(orderCreationCounter);

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString())
      .observe(duration / 1000);
  });

  next();
};

export const getMetrics = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
};

export default register;
