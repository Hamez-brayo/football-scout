import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserType, RegistrationStatus } from '../models/user/types';

const userService = new UserService();

export class UserController {
  async registerUser(req: Request, res: Response) {
    try {
      const { firebaseUid, email, userType } = req.body;

      if (!firebaseUid || !email || !userType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await userService.createUser(firebaseUid, email, userType as UserType);
      return res.status(201).json(user);
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Failed to register user' });
    }
  }

  async createProfile(req: Request, res: Response) {
    try {
      const { userId, userType } = req.body;
      const profileData = req.body.profileData;

      if (!userId || !userType || !profileData) {
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
          return res.status(400).json({ error: 'Invalid user type' });
      }

      await userService.updateRegistrationStatus(userId, RegistrationStatus.COMPLETE);
      return res.status(201).json(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      return res.status(500).json({ error: 'Failed to create profile' });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }
} 