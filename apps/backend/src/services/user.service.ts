import prisma from '../config/prisma';
import { BaseUser, RegistrationStatus, UserType } from '../models/user/types';
import { TalentRegistrationData } from '../models/talent/types';
import { AgentRegistrationData } from '../models/agent/types';
import { ClubRegistrationData } from '../models/club/types';

export class UserService {
  async createUser(firebaseUid: string, email: string, userType: UserType) {
    return prisma.user.create({
      data: {
        id: firebaseUid,
        email,
        userType,
        registrationStatus: RegistrationStatus.PENDING,
      },
    });
  }

  async saveInitialRegistration(userId: string, basicInfo: any) {
    // First, get the user to determine their type
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Save the initial registration data based on user type
    switch (user.userType) {
      case UserType.TALENT:
        return prisma.talent.create({
          data: {
            userId,
            fullName: basicInfo.fullName,
            dateOfBirth: new Date(basicInfo.dateOfBirth),
            nationality: basicInfo.nationality,
            email: basicInfo.email,
            phone: basicInfo.phone,
            address: basicInfo.address,
          },
        });
      case UserType.AGENT:
        return prisma.agent.create({
          data: {
            userId,
            fullName: basicInfo.fullName,
            email: basicInfo.email,
            phone: basicInfo.phone,
            address: basicInfo.address,
          },
        });
      case UserType.CLUB:
        return prisma.club.create({
          data: {
            userId,
            contactName: basicInfo.fullName,
            contactDetails: {
              email: basicInfo.email,
              phone: basicInfo.phone,
              address: basicInfo.address,
            },
          },
        });
      default:
        throw new Error('Invalid user type');
    }
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

  async updateRegistrationStatus(userId: string, status: RegistrationStatus) {
    return prisma.user.update({
      where: { id: userId },
      data: { registrationStatus: status },
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
} 