import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './models/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  public get() {
    return this.usersService.getAll();
  }

  @Get('/:name')
  public async getByName(@Param('name') name: string) {
    const user = await this.usersService.findOneByName(name);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  public add(@Body() dto: UserDto) {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() dto: UserDto) {
    return this.usersService.update(id, dto);
  }
}
