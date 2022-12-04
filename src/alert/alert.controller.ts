import { Controller, Delete, Get, Post } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  async getAlerts() {
    return await this.alertService.getAlerts();
  }

  @Get(':id')
  async getAlert() {
    return await this.alertService.getAlert();
  }

  @Post()
  async createAlert() {
    return await this.alertService.createAlert();
  }

  @Delete()
  async deleteAlert() {
    return await this.alertService.deleteAlert();
  }
}
