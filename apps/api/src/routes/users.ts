import express from 'express';
import { PrismaClient, UserType, PlayingStatus, ExperienceLevel, PreferredFoot, ProfessionalFocus } from '@prisma/client';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Initial registration step (Personal Information)
router.post('/register/initial', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { basicInfo } = req.body;

    console.log('Received registration data:', { uid, basicInfo });

    // First check if user exists
    let user = await prisma.user.findUnique({
      where: { userId: uid }
    });

    if (!user) {
      // Create user if doesn't exist
      console.log('Creating new user:', uid);
      user = await prisma.user.create({
        data: {
          userId: uid,
          fullName: basicInfo.fullName,
          email: basicInfo.email,
          dateOfBirth: basicInfo.dateOfBirth,
          nationality: basicInfo.nationality,
          phone: basicInfo.phone,
          registrationStatus: 'INCOMPLETE',
          userType: 'TALENT' // Default type, will be updated in journey step
        }
      });
    } else {
      // Update existing user
      console.log('Updating existing user:', uid);
      user = await prisma.user.update({
        where: { userId: uid },
        data: {
          fullName: basicInfo.fullName,
          email: basicInfo.email,
          dateOfBirth: basicInfo.dateOfBirth,
          nationality: basicInfo.nationality,
          phone: basicInfo.phone,
          registrationStatus: 'INCOMPLETE'
        }
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error saving initial registration:', error);
    res.status(500).json({ error: 'Failed to save registration data', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Journey information step
router.post('/journey', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { journeyData } = req.body;

    // Map frontend level to ExperienceLevel enum
    const experienceLevelMap: { [key: string]: ExperienceLevel } = {
      'amateur': 'AMATEUR',
      'academy': 'ACADEMY',
      'semi_pro': 'SEMI_PRO',
      'pro': 'PRO'
    };

    // Map frontend path to UserType enum
    const userTypeMap: { [key: string]: UserType } = {
      'player': 'TALENT',
      'agent': 'AGENT',
      'club': 'CLUB'
    };

    const userType = userTypeMap[journeyData.path];
    const playingStatus = journeyData.currentStatus as PlayingStatus;
    const experienceLevel = journeyData.level ? experienceLevelMap[journeyData.level] : undefined;
    const focus = journeyData.focus?.toUpperCase() as ProfessionalFocus | undefined;

    // Update user with journey data
    const updateData: any = {
      userType,
      registrationStatus: 'JOURNEY_COMPLETED',
      playingStatus,
      experienceLevel,
      professionalFocus: focus
    };

    // Add type-specific fields
    if (userType === 'TALENT') {
      updateData.position = '';
      updateData.currentClub = '';
      updateData.preferredFoot = 'RIGHT';
    } else if (userType === 'AGENT') {
      updateData.agencyName = '';
      updateData.yearsExperience = 0;
      updateData.specialties = [];
    } else if (userType === 'CLUB') {
      updateData.clubName = '';
      updateData.clubRole = '';
      updateData.department = '';
    }

    const user = await prisma.user.update({
      where: { userId: uid },
      data: updateData
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error saving journey data:', error);
    res.status(500).json({ error: 'Failed to save journey data' });
  }
});

// Complete registration
router.post('/journey/complete', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;

    const user = await prisma.user.update({
      where: { userId: uid },
      data: {
        registrationStatus: 'COMPLETE'
      }
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error completing registration:', error);
    res.status(500).json({ error: 'Failed to complete registration' });
  }
});

// Check registration status
router.get('/:userId/registration-status', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      isRegistrationComplete: user.registrationStatus === 'COMPLETE',
      status: user.registrationStatus,
      userType: user.userType,
      user
    });
  } catch (error) {
    console.error('Error checking registration status:', error);
    res.status(500).json({ error: 'Failed to check registration status' });
  }
});

export default router; 