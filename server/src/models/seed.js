import db from './index';
// import { hashPassword } from '../lib/passwordOp';

// type = user, conversation, message

const content = ['hello', 'hi', 'how are you?', 'memory', 'quite', 'goodsale'];

const time = [
  'January 27, 2023 23:15:30',
  'January 28, 2023 23:17:30',
  'January 29, 2023 23:00:30',
  'January 30, 2023 23:15:30',
  'January 31, 2023 23:17:30',
  'January 31, 2023 23:18:10',
  'February 01, 2023 23:15:30',
  'February 01, 2023 23:15:45',
  'February 02, 2023 18:15:30',
  'February 03, 2023 17:15:30',
  'February 03, 2023 17:15:50',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getRandomValues = (content) =>
  content[Math.floor(Math.random() * content.length)];

export async function seed() {
  let byDayId = 1;
  for (let i = 0; i < time.length; i++) {
    const currentDate = new Date(time[i]);
    const day =
      +new Date(
        `${
          MONTH_NAMES[currentDate.getMonth()]
        }-${currentDate.getDate()}-${currentDate.getFullYear()}`
      ) / 100000;
    const byDay = await db.messageByDay.findOrCreate({
      where: { dayId: day },
      defaults: {
        dayId: day,
        conversationId: 1,
      },
    });

    const parsed = byDay[0].toJSON();

    if (parsed.id !== byDayId) {
      byDayId = parsed.id;
    }
    console.log('byDay', parsed.id, byDayId);

    await db.message.create({
      userId: 2,
      conversationId: 1,
      haveSeen: false,
      content: getRandomValues(content),
      // timestamp: Math.floor(+new Date(time[i]) / 1000),
      timestamp: String(+new Date(time[i])),
      byDayId,
    });
  }
}

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
// await db.conversation.create({
//   name: '', // id=1
// });
// await db.conversation.create({
//   name: '', // id=2
// });
// await db.conversation.create({
//   name: '', // id=3
// });
// //-----------------------------
// await db.userToConversation.create({
//   userId: 1,
//   conversationId: 1,
// });
// await db.userToConversation.create({
//   userId: 2,
//   conversationId: 1,
// });
// // //-----------------------------
// await db.userToConversation.create({
//   userId: 1,
//   conversationId: 2,
// });
// await db.userToConversation.create({
//   userId: 3,
//   conversationId: 2,
// });
// // //-----------------------------
// await db.userToConversation.create({
//   userId: 2,
//   conversationId: 3,
// });
// await db.userToConversation.create({
//   userId: 3,
//   conversationId: 3,
// });
// //-----------------------------
// await db.message.create({
//   content: 'Hello',
//   userId: 1,
//   conversationId: 1,
// });
// await db.message.create({
//   content: 'Hi',
//   userId: 2,
//   conversationId: 1,
// });
// await db.message.create({
//   content: 'How are you?',
//   userId: 1,
//   conversationId: 1,
// });
// //-----------------------------
// await db.message.create({
//   content: 'Ola',
//   userId: 3,
//   conversationId: 2,
// });
// await db.message.create({
//   content: 'Bonjour',
//   userId: 1,
//   conversationId: 2,
// });
// await db.message.create({
//   content: 'How are you?',
//   userId: 3,
//   conversationId: 2,
// });
// //-----------------------------
// await db.message.create({
//   content: 'Ola',
//   userId: 3,
//   conversationId: 3,
// });
// await db.message.create({
//   content: 'Bonjour',
//   userId: 2,
//   conversationId: 3,
// });
// await db.message.create({
//   content: 'How are you?',
//   userId: 3,
//   conversationId: 3,
// });
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
