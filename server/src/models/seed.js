import db from './index';
// import { hashPassword } from '../lib/passwordOp';

export async function seed() {
  // try {
  //   const user = await db.user.create({
  //     username: 'Encrenoire',
  //     email: 'gaenko037@gmail.com',
  //     password: await hashPassword('1234567'),
  //   });
  //   console.log('user', user.toJSON());
  // await db.user.create({
  //   username: 'userOne',
  //   email: 'userone@gmail.com',
  //   password: await hashPassword('1234567'),
  // });
  // await db.user.create({
  //   username: 'userTwo',
  //   email: 'usertwo@gmail.com',
  //   password: await hashPassword('1234567'),
  // });
  //   await db.user.create({
  //     username: 'Truerich',
  //     email: 'gaenko00037@gmail.com',
  //     password: await hashPassword('1234567'),
  //   });
  // } catch (error) {
  //   console.log('error', error);
  // }
  await db.conversation.create({
    name: '', // id=1
  });
  await db.conversation.create({
    name: '', // id=2
  });
  await db.conversation.create({
    name: '', // id=3
  });
  // //-----------------------------
  await db.userToConversation.create({
    userId: 1,
    conversationId: 1,
  });
  await db.userToConversation.create({
    userId: 2,
    conversationId: 1,
  });
  // //-----------------------------
  await db.userToConversation.create({
    userId: 1,
    conversationId: 2,
  });
  await db.userToConversation.create({
    userId: 3,
    conversationId: 2,
  });
  // //-----------------------------
  await db.userToConversation.create({
    userId: 2,
    conversationId: 3,
  });
  await db.userToConversation.create({
    userId: 3,
    conversationId: 3,
  });
  // //-----------------------------
  await db.message.create({
    content: 'Hello',
    userId: 1,
    conversationId: 1,
  });
  await db.message.create({
    content: 'Hi',
    userId: 2,
    conversationId: 1,
  });
  await db.message.create({
    content: 'How are you?',
    userId: 1,
    conversationId: 1,
  });
  // //-----------------------------
  await db.message.create({
    content: 'Ola',
    userId: 3,
    conversationId: 2,
  });
  await db.message.create({
    content: 'Bonjour',
    userId: 1,
    conversationId: 2,
  });
  await db.message.create({
    content: 'How are you?',
    userId: 3,
    conversationId: 2,
  });
  // //-----------------------------
  await db.message.create({
    content: 'Ola',
    userId: 3,
    conversationId: 3,
  });
  await db.message.create({
    content: 'Bonjour',
    userId: 2,
    conversationId: 3,
  });
  await db.message.create({
    content: 'How are you?',
    userId: 3,
    conversationId: 3,
  });
  //-----------------------------
  // await db.user.create({
  //   username: 'userOne',
  //   email: 'userone@gmail.com',
  //   password: '1234567',
  // });
  // await db.user.create({
  //   username: 'userTwo',
  //   email: 'usertwo@gmail.com',
  //   password: '1234567',
  // });
}
