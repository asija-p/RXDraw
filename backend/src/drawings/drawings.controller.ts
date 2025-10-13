import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { CreateDrawingDto, UpdateDrawingDto } from './models/drawing.dto';
import { SaveDto } from './models/save.dto';

@Controller('drawings')
export class DrawingsController {
  constructor(private drawingService: DrawingsService) {}

  @Get()
  getAll(
    @Query('userId') userId?: string,
    @Query('folderId') folderId?: string,
  ) {
    return this.drawingService.getAll(userId, folderId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.drawingService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateDrawingDto) {
    return this.drawingService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDrawingDto) {
    return this.drawingService.update(id, dto);
  }

  @Put(':id/save')
  save(@Param('id') id: string, @Body() dto: SaveDto) {
    return this.drawingService.save(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.drawingService.delete(id);
  }
}
