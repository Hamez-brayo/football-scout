import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserType, RegistrationStatus } from '../models/user/types';
import { TalentRegistrationData } from '../models/talent/types';
import { PrismaClient } from '@prisma/client';

const userService = new UserService();
const prisma = new PrismaClient();

export class UserController {
  async registerUser(req: Request, res: Response) {
    try {
      const { firebaseUid, email, userType, phone, bio, address } = req.body;
      console.log('Registering user:', { firebaseUid, email, userType, phone, bio, address });

      if (!firebaseUid || !email) {
        console.error('Missing required fields:', { firebaseUid, email });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await userService.createUser(firebaseUid, email, userType as UserType | undefined, phone, bio, address);
      console.log('User registration successful:', user);
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return res.status(200).json({ 
          message: 'User already exists',
          user: await userService.getUserById(req.body.firebaseUid)
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to register user',
        details: error.message
      });
    }
  }

  async saveInitialRegistration(req: Request, res: Response) {
    try {
      const { userId, basicInfo } = req.body;
      console.log('Controller: Received initial registration request:', { userId, basicInfo });

      if (!userId || !basicInfo) {
        console.error('Controller: Missing required fields:', { userId, basicInfo });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // First verify the user exists
      const user = await userService.getUserById(userId);
      if (!user) {
        console.error('Controller: User not found:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Controller: Found user:', user);

      try {
        const result = await userService.saveInitialRegistration(userId, basicInfo);
        console.log('Controller: Initial registration saved:', result);
        return res.status(200).json(result);
      } catch (serviceError) {
        console.error('Controller: Service error:', serviceError);
        return res.status(500).json({ 
          error: 'Failed to save initial registration',
          details: serviceError.message,
          stack: serviceError.stack
        });
      }
    } catch (error) {
      console.error('Controller: Unexpected error:', error);
      return res.status(500).json({ 
        error: 'Failed to save initial registration',
        details: error.message,
        stack: error.stack
      });
    }
  }

  async saveJourneyData(req: Request, res: Response) {
    try {
      const { userId, journeyData } = req.body;
      console.log('Controller: Saving journey data:', { userId, journeyData });

      if (!userId || !journeyData) {
        console.error('Controller: Missing required fields:', { userId, journeyData });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      try {
        const result = await userService.saveJourneyData(userId, journeyData);
        console.log('Controller: Journey data saved:', result);
        return res.status(200).json(result);
      } catch (serviceError) {
        console.error('Controller: Service error:', serviceError);
        return res.status(500).json({ 
          error: 'Failed to save journey data',
          details: serviceError.message,
          stack: serviceError.stack
        });
      }
    } catch (error) {
      console.error('Controller: Unexpected error:', error);
      return res.status(500).json({ 
        error: 'Failed to save journey data',
        details: error.message,
        stack: error.stack
      });
    }
  }

  async savePathDetails(req: Request, res: Response) {
    try {
      const { userId, pathType, pathData } = req.body;
      console.log('Saving path details:', { userId, pathType, pathData });

      if (!userId || !pathType || !pathData) {
        console.error('Missing required fields:', { userId, pathType, pathData });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await userService.savePathDetails(userId, pathType, pathData);
      console.log('Path details saved:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error saving path details:', error);
      return res.status(500).json({ error: 'Failed to save path details' });
    }
  }

  async saveMediaData(req: Request, res: Response) {
    try {
      const { userId, mediaData } = req.body;
      console.log('Saving media data:', { userId, mediaData });

      if (!userId || !mediaData) {
        console.error('Missing required fields:', { userId, mediaData });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await userService.saveMediaData(userId, mediaData);
      console.log('Media data saved:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error saving media data:', error);
      return res.status(500).json({ error: 'Failed to save media data' });
    }
  }

  async completeRegistration(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      console.log('Completing registration for user:', userId);

      if (!userId) {
        console.error('Missing user ID');
        return res.status(400).json({ error: 'Missing user ID' });
      }

      const result = await userService.updateRegistrationStatus(userId, RegistrationStatus.COMPLETE);
      console.log('Registration completed:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error completing registration:', error);
      return res.status(500).json({ error: 'Failed to complete registration' });
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

  async getUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          registrationStatus: true,
          userType: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        registrationCompleted: user.registrationStatus === 'COMPLETED',
        userType: user.userType
      });
    } catch (error) {
      console.error('Error getting user status:', error);
      return res.status(500).json({ error: 'Failed to get user status' });
    }
  }
} 