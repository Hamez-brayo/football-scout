import prisma from '../config/prisma';
import { BaseUser, RegistrationStatus, UserType } from '../models/user/types';
import { TalentRegistrationData } from '../models/talent/types';
import { AgentRegistrationData } from '../models/agent/types';
import { ClubRegistrationData } from '../models/club/types';

export class UserService {
  async createUser(firebaseUid: string, email: string, userType: UserType) {
    return prisma.user.upsert({
      where: {
        id: firebaseUid
      },
      create: {
        id: firebaseUid,
        email,
        userType,
        registrationStatus: RegistrationStatus.PENDING,
      },
      update: {
        email,
        userType,
        registrationStatus: RegistrationStatus.PENDING,
      }
    });
  }

  async saveInitialRegistration(userId: string, basicInfo: any) {
    console.log('Starting saveInitialRegistration with:', { userId, basicInfo });
    
    // First, get the user to determine their type
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        talent: true,
        agent: true,
        club: true
      }
    });

    if (!user) {
      console.error('User not found in saveInitialRegistration:', userId);
      throw new Error('User not found');
    }

    console.log('Found user:', user);
    console.log('Saving initial registration for user type:', user.userType);

    try {
      let result;
      // Save the initial registration data based on user type
      switch (user.userType) {
        case UserType.TALENT:
          console.log('Creating/updating talent profile with:', {
            userId,
            fullName: basicInfo.fullName,
            dateOfBirth: basicInfo.dateOfBirth,
            nationality: basicInfo.nationality,
            email: basicInfo.email,
            phone: basicInfo.phone,
          });
          
          result = await prisma.talent.upsert({
            where: { userId },
            create: {
              userId,
              fullName: basicInfo.fullName,
              dateOfBirth: new Date(basicInfo.dateOfBirth),
              nationality: basicInfo.nationality,
              positions: [], // Initialize with empty array, will be updated later
              // Store additional info in playingHistory JSON
              playingHistory: {
                email: basicInfo.email,
                phone: basicInfo.phone,
                address: basicInfo.address,
                bio: basicInfo.bio
              }
            },
            update: {
              fullName: basicInfo.fullName,
              dateOfBirth: new Date(basicInfo.dateOfBirth),
              nationality: basicInfo.nationality,
              // Update additional info in playingHistory JSON
              playingHistory: {
                email: basicInfo.email,
                phone: basicInfo.phone,
                address: basicInfo.address,
                bio: basicInfo.bio
              }
            },
          });
          break;

        case UserType.AGENT:
          console.log('Creating/updating agent profile with:', {
            userId,
            fullName: basicInfo.fullName,
            email: basicInfo.email,
            phone: basicInfo.phone,
          });
          
          result = await prisma.agent.upsert({
            where: { userId },
            create: {
              userId,
              fullName: basicInfo.fullName,
              operationAreas: [], // Initialize with empty array, will be updated later
              languages: [], // Initialize with empty array, will be updated later
              // Store additional info in references JSON
              references: {
                email: basicInfo.email,
                phone: basicInfo.phone,
                address: basicInfo.address,
                bio: basicInfo.bio
              }
            },
            update: {
              fullName: basicInfo.fullName,
              // Update additional info in references JSON
              references: {
                email: basicInfo.email,
                phone: basicInfo.phone,
                address: basicInfo.address,
                bio: basicInfo.bio
              }
            },
          });
          break;

        case UserType.CLUB:
          const clubData = {
            email: basicInfo.email,
            phone: basicInfo.phone,
            address: basicInfo.address,
            bio: basicInfo.bio
          };

          console.log('Creating/updating club profile with:', {
            userId,
            clubName: basicInfo.fullName,
            contactName: basicInfo.fullName,
            location: basicInfo.address?.country || 'Unknown',
            league: 'Unknown', // Required field, will be updated later
            country: basicInfo.address?.country || 'Unknown',
            position: 'Representative', // Default value, will be updated later
            contactDetails: clubData
          });
          
          result = await prisma.club.upsert({
            where: { userId },
            create: {
              userId,
              clubName: basicInfo.fullName,
              contactName: basicInfo.fullName,
              location: basicInfo.address?.country || 'Unknown',
              league: 'Unknown', // Required field, will be updated later
              country: basicInfo.address?.country || 'Unknown',
              position: 'Representative', // Default value, will be updated later
              contactDetails: clubData
            },
            update: {
              contactName: basicInfo.fullName,
              contactDetails: clubData
            },
          });
          break;

        default:
          console.error('Invalid user type:', user.userType);
          throw new Error(`Invalid user type: ${user.userType}`);
      }

      // Verify the data was saved by fetching it again
      const verifiedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          talent: true,
          agent: true,
          club: true
        }
      });
      
      console.log('Verification - Data saved successfully:', verifiedUser);
      return result;
      
    } catch (error) {
      console.error('Error in saveInitialRegistration switch statement:', error);
      throw error;
    }
  }

  async saveJourneyData(userId: string, journeyData: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    switch (user.userType) {
      case UserType.TALENT:
        return prisma.talent.update({
          where: { userId },
          data: {
            footballProfile: {
              ...journeyData,
            },
          },
        });
      case UserType.AGENT:
        return prisma.agent.update({
          where: { userId },
          data: {
            professionalInfo: {
              ...journeyData,
            },
          },
        });
      case UserType.CLUB:
        return prisma.club.update({
          where: { userId },
          data: {
            clubInfo: {
              ...journeyData,
            },
          },
        });
      default:
        throw new Error('Invalid user type');
    }
  }

  async savePathDetails(userId: string, pathType: string, pathData: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    switch (pathType) {
      case 'player':
        return prisma.talent.update({
          where: { userId },
          data: {
            position: pathData.position,
            currentClub: pathData.currentClub,
            preferredFoot: pathData.preferredFoot,
          },
        });
      case 'agent':
        return prisma.agent.update({
          where: { userId },
          data: {
            agencyName: pathData.agencyName,
            yearsOfExperience: parseInt(pathData.yearsOfExperience),
            specialties: pathData.specialties,
          },
        });
      case 'club':
        return prisma.club.update({
          where: { userId },
          data: {
            clubName: pathData.clubName,
            role: pathData.role,
            department: pathData.department,
          },
        });
      default:
        throw new Error('Invalid path type');
    }
  }

  async saveMediaData(userId: string, mediaData: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    switch (user.userType) {
      case UserType.TALENT:
        return prisma.talent.update({
          where: { userId },
          data: {
            media: {
              ...mediaData,
            },
          },
        });
      case UserType.AGENT:
        return prisma.agent.update({
          where: { userId },
          data: {
            media: {
              ...mediaData,
            },
          },
        });
      case UserType.CLUB:
        return prisma.club.update({
          where: { userId },
          data: {
            media: {
              ...mediaData,
            },
          },
        });
      default:
        throw new Error('Invalid user type');
    }
  }

  async updateRegistrationStatus(userId: string, status: RegistrationStatus) {
    return prisma.user.update({
      where: { id: userId },
      data: { registrationStatus: status },
    });
  }

  async createTalentProfile(userId: string, data: TalentRegistrationData) {
    return prisma.talent.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async createAgentProfile(userId: string, data: AgentRegistrationData) {
    return prisma.agent.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async createClubProfile(userId: string, data: ClubRegistrationData) {
    return prisma.club.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        talent: true,
        agent: true,
        club: true,
      },
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
} 