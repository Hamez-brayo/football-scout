import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Initial registration step (Personal Information)
router.post('/register/initial', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { basicInfo } = req.body;

    // Split the full name into first and last name
    const [firstName, ...lastNameParts] = basicInfo.fullName.trim().split(/\s+/);
    const lastName = lastNameParts.join(' ');

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
          firstName,
          lastName,
          fullName: basicInfo.fullName.trim(),
          email: basicInfo.email,
          dateOfBirth: basicInfo.dateOfBirth,
          nationality: basicInfo.nationality,
          phone: basicInfo.phone,
          registrationStatus: 'INCOMPLETE',
          userType: 'TALENT' // Use the string value directly
        }
      });
    } else {
      // Update existing user
      console.log('Updating existing user:', uid);
      user = await prisma.user.update({
        where: { userId: uid },
        data: {
          firstName,
          lastName,
          fullName: basicInfo.fullName.trim(),
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
    const experienceLevelMap: { [key: string]: string } = {
      'amateur': 'AMATEUR',
      'academy': 'ACADEMY',
      'semi_pro': 'SEMI_PRO',
      'pro': 'PRO'
    };
    // Map frontend path to UserType enum
    const userTypeMap: { [key: string]: string } = {
      'player': 'TALENT',
      'agent': 'AGENT',
      'club': 'CLUB'
    };
    const userType = userTypeMap[journeyData.path];
    const playingStatus = journeyData.currentStatus;
    const experienceLevel = journeyData.level ? experienceLevelMap[journeyData.level] : undefined;
    const focus = journeyData.focus?.toUpperCase();

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

// Get user profile
router.get('/:userId/profile', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Verify user is requesting their own profile
    if (userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Unauthorized to access this profile' });
    }

    console.log('Fetching profile for user:', userId);

    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true
          }
        },
        availability: true,
        socialLinks: true,
        privacySettings: true,
        media: true
      }
    });

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Transform the data to match the expected format
    const profile = {
      user: {
        id: user.userId,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        nickname: user.nickname || '',
        profilePhoto: user.profilePhoto || '',
        coverPhoto: user.coverPhoto || '',
        dateOfBirth: user.dateOfBirth || '',
        nationality: user.nationality || '',
        languages: user.languages || [],
        currentLocation: user.currentLocation || '',
        contactEmail: user.contactEmail || user.email,
        contactPhone: user.contactPhone || '',
      },
      physicalAttributes: user.physicalAttributes || {
        height: null,
        weight: null,
        wingspan: null,
        fitnessLevel: 0,
        preferredFoot: user.preferredFoot || 'RIGHT'
      },
      footballProfile: user.footballProfile || {
        primaryPosition: user.position || '',
        secondaryPositions: [],
        currentClub: user.currentClub || '',
        previousClubs: [],
        playingStyle: [],
        strongFoot: user.preferredFoot || null,
        experience: user.experienceLevel || null,
        achievements: []
      },
      availability: user.availability || {
        isAvailableForTrials: false,
        preferredRegions: [],
        willingToRelocate: false,
        available: true,
        startDate: null,
        endDate: null,
        notes: ''
      },
      media: user.media || [],
      achievements: user.footballProfile?.achievements || [],
      socialLinks: user.socialLinks || {
        twitter: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      },
      privacySettings: user.privacySettings || {
        profileVisibility: 'public',
        contactInfoVisibility: 'private',
        mediaVisibility: 'public'
      }
    };

    console.log('Sending profile response');
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:userId/profile', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Verify user is updating their own profile
    if (userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    const updates = req.body;

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        firstName: updates.user?.firstName,
        lastName: updates.user?.lastName,
        fullName: updates.user?.firstName && updates.user?.lastName 
          ? `${updates.user.firstName} ${updates.user.lastName}`.trim()
          : undefined,
        nickname: updates.user?.nickname,
        profilePhoto: updates.user?.profilePhoto,
        coverPhoto: updates.user?.coverPhoto,
        dateOfBirth: updates.user?.dateOfBirth,
        nationality: updates.user?.nationality,
        languages: updates.user?.languages,
        currentLocation: updates.user?.currentLocation,
        contactEmail: updates.user?.contactEmail,
        contactPhone: updates.user?.contactPhone,
      }
    });

    // Update or create related records
    if (updates.physicalAttributes) {
      await prisma.physicalAttributes.upsert({
        where: { userId },
        create: { ...updates.physicalAttributes, userId },
        update: updates.physicalAttributes
      });
    }

    if (updates.footballProfile) {
      await prisma.footballProfile.upsert({
        where: { userId },
        create: { ...updates.footballProfile, userId },
        update: updates.footballProfile
      });
    }

    if (updates.availability) {
      await prisma.availability.upsert({
        where: { userId },
        create: { ...updates.availability, userId },
        update: updates.availability
      });
    }

    if (updates.socialLinks) {
      await prisma.socialLinks.upsert({
        where: { userId },
        create: { ...updates.socialLinks, userId },
        update: updates.socialLinks
      });
    }

    if (updates.privacySettings) {
      await prisma.privacySettings.upsert({
        where: { userId },
        create: { ...updates.privacySettings, userId },
        update: updates.privacySettings
      });
    }

    // Fetch the updated profile
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        physicalAttributes: true,
        footballProfile: {
          include: {
            achievements: true
          }
        },
        availability: true,
        socialLinks: true,
        privacySettings: true,
        media: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 