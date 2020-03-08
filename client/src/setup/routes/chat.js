import Chat from '../../pages/Chat';
import ChatRoom from '../../pages/ChatRoom';

export default {
  chat: {
    path: '/chat',
    component: Chat,
    auth: true,
    exact: true,
  },

  chatRoom: {
    path: '/chat/:id',
    component: ChatRoom,
    auth: true,
  },
};
