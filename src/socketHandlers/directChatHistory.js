import { Message } from '@root/modules/message/messageModel.js';
import { Conversation } from '@root/modules/conversation/conversationModel.js';
import { updateChatHistoryHandler } from './updates/chat.js';

class DirectChatHistoryHandler {
  async directChatHistory(socket, data) {
    const { userId } = socket.user;

    const { receiverId } = data;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
      type: 'direct',
    });

    if (conversation) {
      updateChatHistoryHandler.updateChatHistory(
        conversation._id.toString(),
        socket.id
      );
    }
  }
}

const directChatHistoryHandler = new DirectChatHistoryHandler();

export { directChatHistoryHandler };
