import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFoundHandler, requestLogger } from '@middleware/error';
import authRoutes from '@routes/auth.routes';
import productRoutes from '@routes/product.routes';
import orderRoutes from '@routes/order.routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ════════════════════════════════════════════════════════════
// MIDDLEWARE GLOBALES
// ════════════════════════════════════════════════════════════

// Seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(requestLogger);

// ════════════════════════════════════════════════════════════
// HEALTH CHECK
// ════════════════════════════════════════════════════════════

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    },
    timestamp: new Date().toISOString(),
  });
});

// ════════════════════════════════════════════════════════════
// RUTAS DE API
// ════════════════════════════════════════════════════════════

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// ════════════════════════════════════════════════════════════
// MANEJO DE ERRORES
// ════════════════════════════════════════════════════════════

app.use(notFoundHandler);
app.use(errorHandler);

// ════════════════════════════════════════════════════════════
// INICIAR SERVIDOR
// ════════════════════════════════════════════════════════════

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 API available at http://localhost:${PORT}/api/v1`);
    console.log(`💚 Health check at http://localhost:${PORT}/health`);
  });
}

export default app;
