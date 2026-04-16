import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  userId!: number;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'int' })
  durationMinutes!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
