import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './models/folder.entity';
import { CreateFolderDto, UpdateFolderDto } from './models/folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder) private folderRepository: Repository<Folder>,
  ) {}

  getAll(userId: string) {
    return this.folderRepository.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
    });
  }

  async create(dto: CreateFolderDto & { userId: string }) {
    const folder = this.folderRepository.create({
      name: dto.name,
      icon: dto.icon,
      user: { id: dto.userId } as any,
    });
    return this.folderRepository.save(folder);
  }

  async update(userId: string, id: string, dto: UpdateFolderDto) {
    const result = await this.folderRepository.update(
      { id, user: { id: userId } as any },
      dto,
    );
    if (!result.affected) throw new NotFoundException('Folder not found');
    return this.folderRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  async delete(userId: string, id: string) {
    const res = await this.folderRepository.delete({
      id,
      user: { id: userId } as any,
    });
    if (!res.affected) throw new NotFoundException('Folder not found');
    return { success: true };
  }
}
