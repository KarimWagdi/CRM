import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Notification client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Notification client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user_${userId}`);
  }

  notifyUser(userId: number, payload: { type: string; title: string; message: string }) {
    this.server.to(`user_${userId}`).emit('notification', payload);
  }

  broadcast(payload: { type: string; title: string; message: string }) {
    this.server.emit('global_notification', payload);
  }
}
