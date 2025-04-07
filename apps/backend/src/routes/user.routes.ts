import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
const userController = new UserController();

// User registration routes
router.post('/register', userController.registerUser.bind(userController));
router.post('/register/initial', userController.saveInitialRegistration.bind(userController));
router.post('/journey', userController.saveJourneyData.bind(userController));
router.post('/path-details', userController.savePathDetails.bind(userController));
router.post('/media', userController.saveMediaData.bind(userController));
router.post('/complete-registration', userController.completeRegistration.bind(userController));
router.post('/profile', userController.createProfile.bind(userController));
router.get('/:userId', userController.getUserProfile);

export default router; 