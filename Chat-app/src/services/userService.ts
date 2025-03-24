import { PrismaClient, User, UserStatus, FriendRequest, RequestStatus } from '@prisma/client';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';

export class UserService {
  // User Management
  async createUser(data: {
    username: string;
    email: string;
    password: string;
    name?: string;
    bio?: string;
    avatar?: string;
  }): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        status: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
    }

    async updateUser(userId:string,data:{
        username?:string,
        email?:string,
        name?:string,
        bio?:string,
        avatar?:string,
        status?:UserStatus,
    }): Promise<Omit<User,'password'>> {
        return await prisma.user.update({
            where:{id:userId},
            data,
            select:{
                id:true,
                username:true,
                email:true,
                name:true,
                bio:true,
                avatar:true,
                status:true,
                lastActive:true,
                createdAt:true,
                updatedAt:true,
            }
        })
    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');
    
        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) throw new Error('Invalid password');
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
          where: { id: userId },
          data: { password: hashedPassword },
        });
    
        return true;
      }
  
  }