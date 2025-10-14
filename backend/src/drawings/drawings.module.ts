import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drawing } from './models/entities/drawing.entity';
import { Layer } from './models/entities/layer.entity';
import { DrawingsController } from './controllers/drawings.controller';
import { LayersController } from './controllers/layers.controller';
import { DrawingsService } from './services/drawings.service';
import { LayersService } from './services/layers.service';
@Module({
  imports: [TypeOrmModule.forFeature([Drawing, Layer])],
  controllers: [DrawingsController, LayersController],
  providers: [DrawingsService, LayersService],
})
export class DrawingsModule {}
