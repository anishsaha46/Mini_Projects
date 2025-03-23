import { PrismaClient, UserStatus, ConversationType, ParticipantRole, MessageContentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // Clean existing data (optional)
  await prisma.blockedUser.deleteMany();
  await prisma.friendRequest.deleteMany();
  await prisma.friend.deleteMany();
  await prisma.messageReaction.deleteMany();
  await prisma.readReceipt.deleteMany();
  await prisma.message.deleteMany();
  await prisma.participantsOnConversations.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Database cleaned');
  
  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const alice = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      password: hashedPassword,
      name: 'Alice Johnson',
      bio: 'Software developer and coffee enthusiast',
      avatar: 'https://i.pravatar.cc/150?u=alice',
      status: UserStatus.ONLINE
    }
  });
  
  const bob = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@example.com',
      password: hashedPassword,
      name: 'Bob Smith',
      bio: 'UX Designer with a passion for minimalism',
      avatar: 'https://i.pravatar.cc/150?u=bob',
      status: UserStatus.ONLINE
    }
  });
  
  const charlie = await prisma.user.create({
    data: {
      username: 'charlie',
      email: 'charlie@example.com',
      password: hashedPassword,
      name: 'Charlie Brown',
      bio: 'Product manager and amateur photographer',
      avatar: 'https://i.pravatar.cc/150?u=charlie',
      status: UserStatus.AWAY
    }
  });
  
  const dave = await prisma.user.create({
    data: {
      username: 'dave',
      email: 'dave@example.com',
      password: hashedPassword,
      name: 'Dave Wilson',
      bio: 'Full-stack developer and gamer',
      avatar: 'https://i.pravatar.cc/150?u=dave',
      status: UserStatus.OFFLINE
    }
  });
  
  const eve = await prisma.user.create({
    data: {
      username: 'eve',
      email: 'eve@example.com',
      password: hashedPassword,
      name: 'Eve Martinez',
      bio: 'Data scientist and book lover',
      avatar: 'https://i.pravatar.cc/150?u=eve',
      status: UserStatus.DO_NOT_DISTURB
    }
  });
  
  console.log('Users created');
  
  // Create friend relationships
  const friendships = [
    { userId: alice.id, friendId: bob.id },
    { userId: alice.id, friendId: charlie.id },
    { userId: bob.id, friendId: charlie.id },
    { userId: bob.id, friendId: dave.id },
    { userId: charlie.id, friendId: eve.id }
  ];
  
  for (const friendship of friendships) {
    await prisma.friend.create({
      data: friendship
    });
  }
  
  console.log('Friendships created');
  
  // Create friend requests
  await prisma.friendRequest.create({
    data: {
      senderId: dave.id,
      receiverId: alice.id,
      status: 'PENDING'
    }
  });
  
  await prisma.friendRequest.create({
    data: {
      senderId: eve.id,
      receiverId: bob.id,
      status: 'PENDING'
    }
  });
  
  console.log('Friend requests created');
  
  // Create direct conversations
  const aliceBobConvo = await prisma.conversation.create({
    data: {
      type: ConversationType.DIRECT,
      createdBy: alice.id
    }
  });
  
  await prisma.participantsOnConversations.createMany({
    data: [
      {
        userId: alice.id,
        conversationId: aliceBobConvo.id,
        role: ParticipantRole.MEMBER
      },
      {
        userId: bob.id,
        conversationId: aliceBobConvo.id,
        role: ParticipantRole.MEMBER
      }
    ]
  });
  
  const aliceCharlieConvo = await prisma.conversation.create({
    data: {
      type: ConversationType.DIRECT,
      createdBy: alice.id
    }
  });
  
  await prisma.participantsOnConversations.createMany({
    data: [
      {
        userId: alice.id,
        conversationId: aliceCharlieConvo.id,
        role: ParticipantRole.MEMBER
      },
      {
        userId: charlie.id,
        conversationId: aliceCharlieConvo.id,
        role: ParticipantRole.MEMBER
      }
    ]
  });
  
  console.log('Direct conversations created');
  
  // Create a group conversation
  const groupConvo = await prisma.conversation.create({
    data: {
      type: ConversationType.GROUP,
      name: 'Project Team',
      description: 'Discussion about the new project',
      avatar: 'https://i.pravatar.cc/150?u=group1',
      createdBy: alice.id
    }
  });
  
  await prisma.participantsOnConversations.createMany({
    data: [
      {
        userId: alice.id,
        conversationId: groupConvo.id,
        role: ParticipantRole.OWNER
      },
      {
        userId: bob.id,
        conversationId: groupConvo.id,
        role: ParticipantRole.ADMIN
      },
      {
        userId: charlie.id,
        conversationId: groupConvo.id,
        role: ParticipantRole.MEMBER
      },
      {
        userId: dave.id,
        conversationId: groupConvo.id,
        role: ParticipantRole.MEMBER
      }
    ]
  });
  
  console.log('Group conversation created');
  
  // Create messages in Alice-Bob conversation
  const aliceToBobMsg1 = await prisma.message.create({
    data: {
      content: 'Hey Bob, how are you doing?',
      contentType: MessageContentType.TEXT,
      senderId: alice.id,
      conversationId: aliceBobConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
    }
  });
  
  const bobToAliceMsg1 = await prisma.message.create({
    data: {
      content: 'Hi Alice! I\'m good, working on that design we discussed.',
      contentType: MessageContentType.TEXT,
      senderId: bob.id,
      conversationId: aliceBobConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 3 + 3600000) // 3 days ago + 1 hour
    }
  });
  
  const aliceToBobMsg2 = await prisma.message.create({
    data: {
      content: 'Great! Can you share a preview when you get a chance?',
      contentType: MessageContentType.TEXT,
      senderId: alice.id,
      conversationId: aliceBobConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 3 + 7200000) // 3 days ago + 2 hours
    }
  });
  
  const bobToAliceMsg2 = await prisma.message.create({
    data: {
      content: 'Sure, here\'s a mockup of the dashboard.',
      contentType: MessageContentType.IMAGE,
      senderId: bob.id,
      conversationId: aliceBobConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
    }
  });
  
  console.log('Alice-Bob messages created');
  
  // Create messages in Group conversation
  await prisma.message.create({
    data: {
      content: 'Welcome everyone to our project team chat!',
      contentType: MessageContentType.TEXT,
      senderId: alice.id,
      conversationId: groupConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
    }
  });
  
  await prisma.message.create({
    data: {
      content: 'Thanks Alice. I\'ve shared the project requirements in our shared drive.',
      contentType: MessageContentType.TEXT,
      senderId: bob.id,
      conversationId: groupConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 5 + 3600000) // 5 days ago + 1 hour
    }
  });
  
  await prisma.message.create({
    data: {
      content: 'I\'ve looked through them. I have some questions about the timeline.',
      contentType: MessageContentType.TEXT,
      senderId: charlie.id,
      conversationId: groupConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 4) // 4 days ago
    }
  });
  
  const daveMsgInGroup = await prisma.message.create({
    data: {
      content: 'I can help with the backend implementation. When do we need to have the first prototype?',
      contentType: MessageContentType.TEXT,
      senderId: dave.id,
      conversationId: groupConvo.id,
      createdAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
    }
  });
  
  console.log('Group messages created');
  
  // Create message with replies
  const aliceReplyToGroup = await prisma.message.create({
    data: {
      content: 'We need the prototype by next Friday. @Dave can you start on the API?',
      contentType: MessageContentType.TEXT,
      senderId: alice.id,
      conversationId: groupConvo.id,
      replyToId: daveMsgInGroup.id,
      createdAt: new Date(Date.now() - 86400000 * 3 + 3600000) // 3 days ago + 1 hour
    }
  });
  
  // Create read receipts
  await prisma.readReceipt.createMany({
    data: [
      {
        userId: bob.id,
        messageId: aliceToBobMsg1.id,
        readAt: new Date(Date.now() - 86400000 * 3 + 1800000) // 3 days ago + 30 minutes
      },
      {
        userId: bob.id,
        messageId: aliceToBobMsg2.id,
        readAt: new Date(Date.now() - 86400000 * 3 + 7500000) // 3 days ago + 2 hours 5 minutes
      },
      {
        userId: alice.id,
        messageId: bobToAliceMsg1.id,
        readAt: new Date(Date.now() - 86400000 * 3 + 4200000) // 3 days ago + 1 hour 10 minutes
      },
      {
        userId: alice.id,
        messageId: bobToAliceMsg2.id,
        readAt: new Date(Date.now() - 86400000 * 2 + 3600000) // 2 days ago + 1 hour
      }
    ]
  });
  
  console.log('Read receipts created');
  
  // Create message reactions
  await prisma.messageReaction.createMany({
    data: [
      {
        emoji: '👍',
        userId: bob.id,
        messageId: aliceToBobMsg2.id
      },
      {
        emoji: '❤️',
        userId: alice.id,
        messageId: bobToAliceMsg2.id
      },
      {
        emoji: '👍',
        userId: charlie.id,
        messageId: daveMsgInGroup.id
      },
      {
        emoji: '🚀',
        userId: bob.id,
        messageId: daveMsgInGroup.id
      },
      {
        emoji: '👍',
        userId: dave.id,
        messageId: aliceReplyToGroup.id
      }
    ]
  });
  
  console.log('Message reactions created');
  
  // Update conversation last message timestamps
  await prisma.conversation.update({
    where: { id: aliceBobConvo.id },
    data: { lastMessageAt: bobToAliceMsg2.createdAt }
  });
  
  await prisma.conversation.update({
    where: { id: groupConvo.id },
    data: { lastMessageAt: aliceReplyToGroup.createdAt }
  });
  
  console.log('Conversation timestamps updated');
  
  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });