import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { NotificationsService } from './notifications.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Public()
  async subscribe(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    this.notificationsService.addClient(res);
    res.write('\n');
  }
}
