import { Message } from '@root/modules/message/messageModel.js';
import { Conversation } from '@root/modules/conversation/conversationModel.js';
import { updateChatHistoryHandler } from './updates/chat.js';

class DirectMessageHandler {
  async directMessage(socket, data) {
    const { userId } = socket.user;
    const { receiverId, content } = data;

    const message = await Message.create({
      content,
      author: userId,
      type: 'direct',
    });

    const conversation = await Conversation.findOneAndUpdate(
      { participants: { $elemMatch: { $in: [userId, receiverId] } } },
      {
        $set: { participants: [userId, receiverId] },
        $push: { messages: message._id },
      },
      { upsert: true, new: true }
    ).exec();

    updateChatHistoryHandler.updateChatHistory(conversation._id.toString());
  }
}

const directMessageHandler = new DirectMessageHandler();

export { directMessageHandler };
