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
  Req,
  UseGuards,
} from '@nestjs/common';
import { DrawingsService } from '../services/drawings.service';
import { CreateDrawingDto, UpdateDrawingDto } from '../models/dtos/drawing.dto';
import { SaveDto } from '../models/dtos/save.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('drawings')
export class DrawingsController {
  constructor(private drawingService: DrawingsService) {}

  @Get()
  getAll(@Req() req: any, @Query('folderId') folderId?: string) {
    return this.drawingService.getAll(req.user.id, folderId);
  }

  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) {
    return this.drawingService.getById(req.user.id, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateDrawingDto) {
    return this.drawingService.create({ ...dto, userId: req.user.id });
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateDrawingDto,
  ) {
    return this.drawingService.update(req.user.id, id, dto);
  }

  @Put(':id/save')
  save(@Req() req: any, @Param('id') id: string, @Body() dto: SaveDto) {
    return this.drawingService.save(req.user.id, id, dto);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.drawingService.delete(req.user.id, id);
  }
}
