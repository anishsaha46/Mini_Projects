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

  export const conversationSchema = z.object({
    id: z.string().uuid(),
    type: ConversationTypeEnum,
    name: z.string().nullable(),
    description: z.string().nullable(),
    avatar: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    lastMessageAt: z.date(),
    createdBy: z.string().nullable(),
  });

  export const messageSchema = z.object({
    id: z.string().uuid(),
    content: z.string(),
    contentType: MessageContentTypeEnum,
    senderId: z.string().uuid(),
    conversationId: z.string().uuid(),
    replyToId: z.string().uuid().nullable(),
    isEdited: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  export const participantSchema = z.object({
    userId: z.string().uuid(),
    conversationId: z.string().uuid(),
    role: ParticipantRoleEnum,
    joinedAt: z.date(),
    lastReadAt: z.date(),
    isMuted: z.boolean(),
    isHidden: z.boolean(),
  });

  export const friendRequestSchema = z.object({
    id: z.string().uuid(),
    senderId: z.string().uuid(),
    receiverId: z.string().uuid(),
    status: RequestStatusEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  export const messageReactionSchema = z.object({
    id: z.string().uuid(),
    emoji: z.string(),
    userId: z.string().uuid(),
    messageId: z.string().uuid(),
    createdAt: z.date(),
  });

  export const friendSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    friendId: z.string().uuid(),
    createdAt: z.date(),
  });
  
  export const blockedUserSchema = z.object({
    id: z.string().uuid(),
    blockerId: z.string().uuid(),
    blockedId: z.string().uuid(),
    reason: z.string().nullable(),
    createdAt: z.date(),
  });