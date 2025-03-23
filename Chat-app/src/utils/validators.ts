import {z} from 'zod';

// Enums
export const UserStatusEnum = z.enum(['ONLINE', 'OFFLINE', 'AWAY', 'DO_NOT_DISTURB']);
export const ConversationTypeEnum = z.enum(['DIRECT', 'GROUP']);
export const ParticipantRoleEnum = z.enum(['OWNER', 'ADMIN', 'MEMBER']);
export const MessageContentTypeEnum = z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE']);
export const RequestStatusEnum = z.enum(['PENDING', 'ACCEPTED', 'REJECTED']);
