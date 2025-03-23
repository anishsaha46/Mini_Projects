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

  // Input Validators (for API requests)
export const createUserInput = userSchema.omit({
    id: true,
    status: true,
    lastActive: true,
    createdAt: true,
    updatedAt: true,
  });
  
  export const createMessageInput = messageSchema.omit({
    id: true,
    isEdited: true,
    createdAt: true,
    updatedAt: true,
  });
  
  export const createConversationInput = conversationSchema.omit({
    id: true,
    lastMessageAt: true,
    createdAt: true,
    updatedAt: true,
  });
  
  export const createFriendRequestInput = friendRequestSchema.omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  });

  // Response Types
export const userResponse = userSchema.omit({ password: true });
export const messageResponse = messageSchema.extend({
  sender: userResponse,
  reactions: z.array(messageReactionSchema),
});
export const conversationResponse = conversationSchema.extend({
  participants: z.array(participantSchema.extend({ user: userResponse })),
  messages: z.array(messageSchema),
});


// TypeScript types
export type CreateUserInput = z.infer<typeof createUserInput>;
export type CreateMessageInput = z.infer<typeof createMessageInput>;
export type CreateConversationInput = z.infer<typeof createConversationInput>;
export type CreateFriendRequestInput = z.infer<typeof createFriendRequestInput>;
export type UserResponse = z.infer<typeof userResponse>;
export type MessageResponse = z.infer<typeof messageResponse>;
export type ConversationResponse = z.infer<typeof conversationResponse>;