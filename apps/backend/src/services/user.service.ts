import { BaseUser, UserType } from '../models/user/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async createUser(userData: Partial<BaseUser>): Promise<BaseUser> {
    return await prisma.user.create({
      data: {
        userId: userData.userId!,
        email: userData.email!,
        fullName: userData.fullName!,
        userType: userData.userType || UserType.TALENT,
        firstName: userData.firstName,
        lastName: userData.lastName,
        nickname: userData.nickname,
        profilePhoto: userData.profilePhoto,
        coverPhoto: userData.coverPhoto,
        dateOfBirth: userData.dateOfBirth,
        nationality: userData.nationality,
        languages: userData.languages,
        currentLocation: userData.currentLocation,
        contactEmail: userData.contactEmail,
        contactPhone: userData.contactPhone,
      },
    });
  }

  async updateUser(userId: string, userData: Partial<BaseUser>): Promise<BaseUser> {
    return await prisma.user.update({
      where: { userId },
      data: userData,
    });
  }

  async getUser(userId: string): Promise<BaseUser | null> {
    return await prisma.user.findUnique({
      where: { userId },
    });
  }

  async getUserByEmail(email: string): Promise<BaseUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { userId },
    });
  }
} 