import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LayersService } from './layers.service';
import { CreateLayerDto, UpdateLayerDto } from './models/layer.dto';

@Controller('layers')
export class LayersController {
  constructor(private layersService: LayersService) {}

  @Get()
  getAll(@Query('drawingId') drawingId: string) {
    return this.layersService.getAll(drawingId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.layersService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateLayerDto) {
    return this.layersService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLayerDto) {
    return this.layersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.layersService.delete(id);
  }
}
