import { Module, Global } from '@nestjs/common';
import { NotificationGateway } from './gateways/notification.gateway';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationsModule {}
