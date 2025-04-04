import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// User registration routes
router.post('/register', userController.registerUser);
router.post('/register/initial', userController.saveInitialRegistration);
router.post('/profile', userController.createProfile);
router.get('/:userId', userController.getUserProfile);

export default router; 