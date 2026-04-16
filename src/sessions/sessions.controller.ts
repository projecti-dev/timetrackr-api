import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post('start')
  async start(@Request() req: any) {
    return this.sessionsService.startSession(req.user.sub);
  }

  @Post('end')
  async end(@Request() req: any) {
    return this.sessionsService.endSession(req.user.sub);
  }

  @Get('active')
  async active(@Request() req: any) {
    return this.sessionsService.getActiveSession(req.user.sub);
  }

  @Get('stats')
  async stats(@Request() req: any) {
    return this.sessionsService.getStats(req.user.sub);
  }
}
