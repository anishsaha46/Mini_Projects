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

    //   friend Management
    async sendFriendRequest(senderId: string, receiverId: string): Promise<FriendRequest> {
        // Check if request already exists
        const existingRequest = await prisma.friendRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId,
              receiverId,
            },
          },
        });
        if (existingRequest) throw new Error('Friend request already exists');
    
        return await prisma.friendRequest.create({
          data: {
            senderId,
            receiverId,
          },
        });
      }



      async handleFriendRequest(requestId: string, status: RequestStatus): Promise<void> {
        const request = await prisma.friendRequest.findUnique({
          where: { id: requestId },
        });
        if (!request) throw new Error('Friend request not found');
    
        await prisma.$transaction(async (tx) => {
          await tx.friendRequest.update({
            where: { id: requestId },
            data: { status },
          });
    
          if (status === 'ACCEPTED') {
            // Create friend relationship for both users
            await tx.friend.createMany({
              data: [
                { userId: request.senderId, friendId: request.receiverId },
                { userId: request.receiverId, friendId: request.senderId },
              ],
            });
          }
        });
      }


  // Blocking Management
  async blockUser(blockerId: string, blockedId: string, reason?: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Remove any existing friend relationships
      await tx.friend.deleteMany({
        where: {
          OR: [
            { userId: blockerId, friendId: blockedId },
            { userId: blockedId, friendId: blockerId },
          ],
        },
      });

      // Create block relationship
      await tx.blockedUser.create({
        data: {
          blockerId,
          blockedId,
          reason,
        },
      });
    });
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    await prisma.blockedUser.delete({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });
  }


    // Query Methods
    async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
        return await prisma.user.findUnique({
          where: { id: userId },
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
      }

      async getFriendList(userId: string): Promise<Array<Omit<User, 'password'>>> {
        const friends = await prisma.friend.findMany({
          where: { userId },
          include: {
            friend: {
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
            },
          },
        });
        return friends.map(f => f.friend);
      }

  }