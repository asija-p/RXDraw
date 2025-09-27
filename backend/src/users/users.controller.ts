import {
  Body,
  Controller,
  Delete,
  Get,
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
  public getUsers() {
    return this.usersService.getAll();
  }

  @Post()
  public addUser(@Body() dto: UserDto) {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  public deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Put(':id')
  public updateUser(@Param('id') id: string, @Body() dto: UserDto) {
    return this.usersService.update(id, dto);
  }
}
