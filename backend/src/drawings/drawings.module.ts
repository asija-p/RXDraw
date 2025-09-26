import { Module } from '@nestjs/common';
import { DrawingsController } from './drawings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drawing } from './entities/drawing.entity';
import { DrawingsService } from './drawings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Drawing])],
  controllers: [DrawingsController],
  providers: [DrawingsService],
})
export class DrawingsModule {}
