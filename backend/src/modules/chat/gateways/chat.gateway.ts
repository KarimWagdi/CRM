import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room_${roomId}`);
    const messages = await this.chatService.getMessages(roomId);
    client.emit('previousMessages', messages);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: number; content: string; userId: number; parentId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.saveMessage(
      data.userId,
      data.roomId,
      data.content,
      data.parentId,
    );
    this.server.to(`room_${data.roomId}`).emit('message', message);
  }

  @SubscribeMessage('getRooms')
  async handleGetRooms(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const rooms = await this.chatService.getRoomsForUser(userId);
    client.emit('rooms', rooms);
  }
}
