import { SocketServer } from '../../socketServer.js';
import { Conversation } from '@root/modules/conversation/conversationModel.js';
import { connectedUsersManager } from '../../serverStore.js';

class UpdateChatHistoryHandler {
  constructor() {
    this.socketServer = new SocketServer();
  }

  async updateChatHistory(
    conversationId,
    toSpecifiedSocketId = null,
    receiverId
  ) {
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

    const emitToSocketIds = Array.isArray(emitToSocketId)
      ? emitToSocketId
      : [emitToSocketId];

    // console.log('emitToSocketIds', emitToSocketIds);

    emitToSocketIds.forEach((participant) => {
      const activeConnections = connectedUsersManager.getActiveConnections(
        participant.toString()
      );

      // console.log('activeConnections', activeConnections);

      const onlineUsers = connectedUsersManager.getOnlineUsers();

      const isReceiverOnline = onlineUsers.filter((receiver) => {
        // console.log('receiver', receiver);
        return receiver.userId === receiverId;
      });

      if (isReceiverOnline.length === 0) {
        console.log('message two correct without mark');
      }

      activeConnections.forEach((socketId) => {
        this.socketServer.io
          .to(socketId)
          .emit('direct-chat-history', emitMessage);
      });
    });
  }
}

const updateChatHistoryHandler = new UpdateChatHistoryHandler();

export { updateChatHistoryHandler };
