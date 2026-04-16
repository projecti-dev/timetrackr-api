import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async addEntry(
    userId: number,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<Session> {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let durationMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (durationMinutes < 0) durationMinutes += 24 * 60;

    if (durationMinutes === 0) {
      throw new BadRequestException('Start and end time cannot be the same');
    }

    const session = this.sessionsRepository.create({
      userId,
      date,
      startTime,
      endTime,
      durationMinutes,
    });

    return this.sessionsRepository.save(session);
  }

  async getEntries(userId: number): Promise<Session[]> {
    return this.sessionsRepository.find({
      where: { userId },
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async deleteEntry(userId: number, id: number): Promise<void> {
    await this.sessionsRepository.delete({ id, userId });
  }

  async getStats(userId: number) {
    const entries = await this.sessionsRepository.find({
      where: { userId },
    });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];

    let daily = 0;
    let weekly = 0;
    let monthly = 0;

    entries.forEach((e) => {
      if (e.date === todayStr) daily += e.durationMinutes;
      if (e.date >= weekStartStr) weekly += e.durationMinutes;
      if (e.date >= monthStart) monthly += e.durationMinutes;
    });

    return { daily, weekly, monthly };
  }
}
