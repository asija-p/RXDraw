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
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './models/folder.dto';

@Controller('folders')
export class FoldersController {
  constructor(private folders: FoldersService) {}

  @Get()
  getAll(@Query('userId') userId?: string) {
    return this.folders.getAll(userId);
  }

  @Post()
  create(@Body() dto: CreateFolderDto) {
    return this.folders.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFolderDto) {
    return this.folders.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folders.delete(id);
  }
}
