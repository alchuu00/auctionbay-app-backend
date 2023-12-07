import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { NotificationsService } from './notifications.service';
import { Public } from 'src/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Notification } from 'src/entities/notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Subscribe to notifications' })
  @ApiResponse({ status: 200, description: 'Subscription successful.' })
  async subscribe(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    this.notificationsService.addClient(res);
    res.write('\n');
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications fetched successfully.',
    type: [Notification],
  })
  async getAll() {
    return this.notificationsService.findAll();
  }
}
