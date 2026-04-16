import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Session } from './session.entity';
import dayjs from 'dayjs';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async startSession(userId: number): Promise<Session> {
    const active = await this.sessionsRepository.findOne({
      where: { userId, endTime: null },
    });

    if (active) {
      throw new BadRequestException('You already have an active session');
    }

    const session = this.sessionsRepository.create({
      userId,
      startTime: new Date(),
      endTime: null,
    });

    return this.sessionsRepository.save(session);
  }

  async endSession(userId: number): Promise<Session> {
    const active = await this.sessionsRepository.findOne({
      where: { userId, endTime: null },
    });

    if (!active) {
      throw new BadRequestException('No active session found');
    }

    active.endTime = new Date();
    return this.sessionsRepository.save(active);
  }

  async getActiveSession(userId: number): Promise<Session | null> {
    return this.sessionsRepository.findOne({
      where: { userId, endTime: null },
    });
  }

  async getStats(userId: number) {
    const now = dayjs();

    const todayStart = now.startOf('day').toDate();
    const todayEnd = now.endOf('day').toDate();

    const weekStart = now.startOf('week').toDate();
    const weekEnd = now.endOf('week').toDate();

    const monthStart = now.startOf('month').toDate();
    const monthEnd = now.endOf('month').toDate();

    const [daily, weekly, monthly] = await Promise.all([
      this.sessionsRepository.find({
        where: { userId, startTime: Between(todayStart, todayEnd) },
      }),
      this.sessionsRepository.find({
        where: { userId, startTime: Between(weekStart, weekEnd) },
      }),
      this.sessionsRepository.find({
        where: { userId, startTime: Between(monthStart, monthEnd) },
      }),
    ]);

    return {
      daily: this.calcTotal(daily),
      weekly: this.calcTotal(weekly),
      monthly: this.calcTotal(monthly),
    };
  }

  private calcTotal(sessions: Session[]): number {
    return sessions.reduce((total, session) => {
      const end = session.endTime ? new Date(session.endTime) : new Date();
      const ms = end.getTime() - new Date(session.startTime).getTime();
      return total + ms;
    }, 0);
  }
}
