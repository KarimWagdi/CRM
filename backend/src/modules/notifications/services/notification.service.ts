import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  sendUserNotification(userId: number, title: string, message: string, type = 'info') {
    this.gateway.notifyUser(userId, { type, title, message });
  }

  sendGlobalNotification(title: string, message: string, type = 'info') {
    this.gateway.broadcast({ type, title, message });
  }
}
