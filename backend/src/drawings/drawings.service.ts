import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing } from './models/drawing.entity';
import { CreateDrawingDto, UpdateDrawingDto } from './models/drawing.dto';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectRepository(Drawing) private drawingRepository: Repository<Drawing>,
  ) {}

  public getAll(userId?: string, folderId?: string) {
    const where: any = {};
    if (userId) where.user = { id: userId };
    if (folderId) where.folder = { id: folderId };
    return this.drawingRepository.find({
      where,
      order: { updatedAt: 'DESC' },
      relations: [],
      select: {
        id: true,
        name: true,
        width: true,
        height: true,
        thumbnailUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  public async getById(id: string) {
    const d = await this.drawingRepository.findOne({
      where: { id },
      relations: { layers: true, folder: true, user: true },
      order: { layers: { zIndex: 'DESC' } },
    });
    if (!d) throw new NotFoundException('Drawing not found');
    return d;
  }

  public async create(dto: CreateDrawingDto) {
    const drawing = this.drawingRepository.create({
      name: dto.name,
      width: dto.width,
      height: dto.height,
      thumbnailUrl: dto.thumbnailUrl,
      colors: dto.colors ?? [],
      user: { id: dto.userId } as any,
      ...(dto.folderId ? { folder: { id: dto.folderId } as any } : {}),
    });
    return await this.drawingRepository.save(drawing);
  }

  public async update(id: string, dto: UpdateDrawingDto) {
    const patch: any = {
      name: dto.name,
      width: dto.width,
      height: dto.height,
      thumbnailUrl: dto.thumbnailUrl ?? undefined,
      colors: dto.colors ?? undefined,
    };

    if (dto.folderId === null) {
      patch.folder = null;
    } else if (dto.folderId) {
      patch.folder = { id: dto.folderId } as any;
    }

    await this.drawingRepository.update(id, patch);
    return this.getById(id);
  }

  public delete(id: string) {
    return this.drawingRepository.delete(id);
  }
}
