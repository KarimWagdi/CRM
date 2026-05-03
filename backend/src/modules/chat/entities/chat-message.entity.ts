import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity()
@Tree("materialized-path")
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => ChatRoom, (room) => room.messages)
  room: ChatRoom;

  @TreeChildren()
  replies: ChatMessage[];

  @TreeParent()
  parent: ChatMessage;

  @CreateDateColumn()
  createdAt: Date;
}
