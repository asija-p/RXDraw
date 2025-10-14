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
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './models/folder.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private folders: FoldersService) {}

  @Get()
  getAll(@Req() req: any) {
    return this.folders.getAll(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateFolderDto) {
    return this.folders.create({ ...dto, userId: req.user.id });
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
  ) {
    return this.folders.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.folders.delete(req.user.id, id);
  }
}
