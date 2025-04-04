import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserType, RegistrationStatus } from '../models/user/types';
import { TalentRegistrationData } from '../models/talent/types';

const userService = new UserService();

export class UserController {
  async registerUser(req: Request, res: Response) {
    try {
      const { firebaseUid, email, userType } = req.body;
      console.log('Registering user:', { firebaseUid, email, userType });

      if (!firebaseUid || !email || !userType) {
        console.error('Missing required fields:', { firebaseUid, email, userType });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await userService.createUser(firebaseUid, email, userType as UserType);
      console.log('User created successfully:', user);
      return res.status(201).json(user);
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Failed to register user' });
    }
  }

  async saveInitialRegistration(req: Request, res: Response) {
    try {
      const { userId, basicInfo } = req.body;
      console.log('Saving initial registration:', { userId, basicInfo });

      if (!userId || !basicInfo) {
        console.error('Missing required fields:', { userId, basicInfo });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // First check if the user exists
      const existingUser = await userService.getUserById(userId);
      if (!existingUser) {
        console.error('User not found:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      // Save the initial registration data
      const result = await userService.saveInitialRegistration(userId, basicInfo);
      console.log('Initial registration saved:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error saving initial registration:', error);
      return res.status(500).json({ 
        error: 'Failed to save initial registration',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createProfile(req: Request, res: Response) {
    try {
      const { userId, userType } = req.body;
      const profileData = req.body.profileData;
      console.log('Creating profile:', { userId, userType, profileData });

      if (!userId || !userType || !profileData) {
        console.error('Missing required fields:', { userId, userType, profileData });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let profile;
      switch (userType) {
        case UserType.TALENT:
          profile = await userService.createTalentProfile(userId, profileData);
          break;
        case UserType.AGENT:
          profile = await userService.createAgentProfile(userId, profileData);
          break;
        case UserType.CLUB:
          profile = await userService.createClubProfile(userId, profileData);
          break;
        default:
          console.error('Invalid user type:', userType);
          return res.status(400).json({ error: 'Invalid user type' });
      }

      await userService.updateRegistrationStatus(userId, RegistrationStatus.COMPLETE);
      console.log('Profile created successfully:', profile);
      return res.status(201).json(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      return res.status(500).json({ error: 'Failed to create profile' });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      console.log('Fetching user profile:', userId);

      const user = await userService.getUserById(userId);

      if (!user) {
        console.error('User not found:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('User profile found:', user);
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }
} 