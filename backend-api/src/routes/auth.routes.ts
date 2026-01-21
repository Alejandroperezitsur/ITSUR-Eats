import { Router } from 'express';
import { authController } from '@controllers/auth.controller';
import { authenticateJWT } from '@middleware/auth';
import { validateBody } from '@middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required(),
  name: Joi.string().min(2).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Routes
router.post('/register', validateBody(registerSchema), (req: any, res: any) =>
  authController.register(req, res)
);

router.post('/login', validateBody(loginSchema), (req: any, res: any) => authController.login(req, res));

router.post('/refresh', (req: any, res: any) => authController.refresh(req, res));

router.post('/logout', (req, res) => authController.logout(req, res));

router.get('/me', authenticateJWT, (req, res) => authController.getMe(req, res));

export default router;
