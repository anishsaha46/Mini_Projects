import {z} from 'zod';

// Enums
export const UserStatusEnum = z.enum(['ONLINE', 'OFFLINE', 'AWAY', 'DO_NOT_DISTURB']);
export const ConversationTypeEnum = z.enum(['DIRECT', 'GROUP']);
export const ParticipantRoleEnum = z.enum(['OWNER', 'ADMIN', 'MEMBER']);
export const MessageContentTypeEnum = z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE']);
export const RequestStatusEnum = z.enum(['PENDING', 'ACCEPTED', 'REJECTED']);

//Base Schemas
export const userSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().nullable(),
    bio: z.string().nullable(),
    avatar: z.string().nullable(),
    status: UserStatusEnum,
    lastActive: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

