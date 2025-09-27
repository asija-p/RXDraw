import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './models/folder.entity';
import { CreateFolderDto, UpdateFolderDto } from './models/folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder) private folderRepository: Repository<Folder>,
  ) {}

  public getAll(userId?: string) {
    if (userId) {
      return this.folderRepository.find({
        where: { user: { id: userId } },
        order: { name: 'ASC' },
      });
    }
    return this.folderRepository.find({ order: { name: 'ASC' } });
  }

  public async create(dto: CreateFolderDto) {
    const folder = this.folderRepository.create({
      name: dto.name,
      user: { id: dto.userId } as any,
    });
    return await this.folderRepository.save(folder);
  }

  public async update(id: string, dto: UpdateFolderDto) {
    await this.folderRepository.update(id, dto);
    return this.folderRepository.findOne({ where: { id } });
  }

  public delete(id: string) {
    return this.folderRepository.delete(id);
  }
}
