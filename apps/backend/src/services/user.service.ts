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