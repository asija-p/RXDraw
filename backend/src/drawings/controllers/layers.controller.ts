import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LayersService } from '../services/layers.service';
import { CreateLayerDto, UpdateLayerDto } from '../models/dtos/layer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('layers')
export class LayersController {
  constructor(private layersService: LayersService) {}

  @Get()
  getAll(@Req() req: any, @Query('drawingId') drawingId?: string) {
    return this.layersService.getAll(req.user.id, drawingId);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.layersService.getById(req.user.id, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateLayerDto) {
    return this.layersService.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateLayerDto,
  ) {
    return this.layersService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.layersService.delete(req.user.id, id);
  }
}
