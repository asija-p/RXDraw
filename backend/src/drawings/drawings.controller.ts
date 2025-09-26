import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DrawingsService } from './drawings.service';

@Controller('drawings')
export class DrawingsController {
  constructor(private drawingService: DrawingsService) {}

  @Get()
  public getDrawings() {
    return this.drawingService.getAll();
  }

  @Get(':id')
  public getDrawing(@Param('id') id: string) {
    return this.drawingService.getById(id);
  }
}
