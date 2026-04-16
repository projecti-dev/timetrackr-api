import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { IsString, IsNotEmpty } from 'class-validator';

class AddEntryDto {
  @IsString() @IsNotEmpty() date!: string;
  @IsString() @IsNotEmpty() startTime!: string;
  @IsString() @IsNotEmpty() endTime!: string;
}

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post('entry')
  async addEntry(@Request() req: any, @Body() body: AddEntryDto) {
    return this.sessionsService.addEntry(
      req.user.sub,
      body.date,
      body.startTime,
      body.endTime,
    );
  }

  @Get('entries')
  async getEntries(@Request() req: any) {
    return this.sessionsService.getEntries(req.user.sub);
  }

  @Delete('entry/:id')
  async deleteEntry(@Request() req: any, @Param('id') id: string) {
    return this.sessionsService.deleteEntry(req.user.sub, parseInt(id));
  }

  @Get('stats')
  async stats(@Request() req: any) {
    return this.sessionsService.getStats(req.user.sub);
  }
}
