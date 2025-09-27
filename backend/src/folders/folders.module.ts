import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { Folder } from './models/folder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Folder])],
  providers: [FoldersService],
  controllers: [FoldersController],
})
export class FoldersModule {}
