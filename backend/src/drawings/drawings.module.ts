import { Module } from '@nestjs/common';
import { DrawingsController } from './drawings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drawing } from './models/drawing.entity';
import { DrawingsService } from './drawings.service';
import { LayersService } from './layers.service';
import { LayersController } from './layers.controller';
import { Layer } from './models/layer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Drawing, Layer])],
  controllers: [DrawingsController, LayersController],
  providers: [DrawingsService, LayersService],
})
export class DrawingsModule {}
