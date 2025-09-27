import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { UserDto } from './models/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public getAll() {
    return this.userRepository.find();
  }

  public async create(userDto: UserDto) {
    const user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  public async delete(id: string) {
    return await this.userRepository.delete(id);
  }

  public async update(id: string, dto: UserDto) {
    return await this.userRepository.update(id, dto);
  }
}
