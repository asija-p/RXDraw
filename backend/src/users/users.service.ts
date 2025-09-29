import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { UserDto } from './models/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public getAll() {
    return this.userRepository.find();
  }

  public async findOneByName(name: string) {
    return this.userRepository.findOne({ where: { name } });
  }

  public findAuthByName(name: string) {
    return this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.name = :name', { name })
      .getOne();
  }

  async create(dto: { name: string; password: string }) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepository.create({ name: dto.name, passwordHash });
    const saved = await this.userRepository.save(user);
    (saved as any).passwordHash = undefined;
    return saved;
  }

  public async delete(id: string) {
    return await this.userRepository.delete(id);
  }

  public async update(id: string, dto: UserDto) {
    return await this.userRepository.update(id, dto);
  }
}
