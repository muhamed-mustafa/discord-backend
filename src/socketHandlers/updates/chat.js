import { SocketServer } from '../../socketServer.js';
import { Conversation } from '@root/modules/conversation/conversationModel.js';
import { connectedUsersManager } from '../../serverStore.js';

class UpdateChatHistoryHandler {
  constructor() {
    this.socketServer = new SocketServer();
  }

  async updateChatHistory(conversationId, toSpecifiedSocketId = null) {
    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'author',
          model: 'User',
          select: 'username _id',
        },
      })
      .exec();

    if (!conversation) {
      return;
    }

    const emitToSocketId = toSpecifiedSocketId ?? conversation.participants;

    const emitMessage = {
      messages: conversation.messages,
      participants: conversation.participants,
    };

    const emitToSocketIds = Array.isArray(emitToSocketId) ? emitToSocketId : [emitToSocketId];

    emitToSocketIds.forEach((participant) => {
      const activeConnections = connectedUsersManager.getActiveConnections(participant.toString());

      activeConnections.forEach((socketId) => {
        this.socketServer.io.to(socketId).emit('direct-chat-history', emitMessage);
      });
    });
  }
}

const updateChatHistoryHandler = new UpdateChatHistoryHandler();

export { updateChatHistoryHandler };
