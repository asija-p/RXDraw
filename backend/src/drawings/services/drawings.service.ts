import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing } from '../models/entities/drawing.entity';
import { CreateDrawingDto, UpdateDrawingDto } from '../models/dtos/drawing.dto';
import { Layer } from '../models/entities/layer.entity';
import { SaveDto, SaveLayerDto } from '../models/dtos/save.dto';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectRepository(Drawing) private drawingRepository: Repository<Drawing>,
    @InjectRepository(Layer) private layersRepository: Repository<Layer>,
  ) {}

  getAll(userId: string, folderId?: string) {
    const where: any = { user: { id: userId } };
    if (folderId) where.folder = { id: folderId };

    return this.drawingRepository.find({
      where,
      order: { updatedAt: 'DESC' },
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

  async getById(userId: string, id: string) {
    const d = await this.drawingRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { layers: true, folder: true, user: true },
      order: { layers: { zIndex: 'DESC' } },
    });
    if (!d) throw new NotFoundException('Drawing not found');
    return d;
  }

  async create(dto: CreateDrawingDto & { userId: string }) {
    const drawing = this.drawingRepository.create({
      name: dto.name,
      width: dto.width,
      height: dto.height,
      thumbnailUrl: dto.thumbnailUrl,
      colors: dto.colors ?? [],
      user: { id: dto.userId } as any,
      ...(dto.folderId ? { folder: { id: dto.folderId } as any } : {}),
    });
    return this.drawingRepository.save(drawing);
  }

  async update(userId: string, id: string, dto: UpdateDrawingDto) {
    const patch: any = {
      name: dto.name,
      width: dto.width,
      height: dto.height,
      thumbnailUrl: dto.thumbnailUrl ?? undefined,
      colors: dto.colors ?? undefined,
    };

    if (dto.folderId === null) patch.folder = null;
    else if (dto.folderId) patch.folder = { id: dto.folderId } as any;

    const res = await this.drawingRepository.update(
      { id, user: { id: userId } as any },
      patch,
    );
    if (!res.affected) throw new NotFoundException('Drawing not found');
    return this.getById(userId, id);
  }

  async save(userId: string, id: string, dto: SaveDto) {
    return this.drawingRepository.manager.transaction(async (m) => {
      const drawings = m.getRepository(Drawing);
      const layers = m.getRepository(Layer);

      const existing = await drawings.findOne({
        where: { id, user: { id: userId } as any },
        relations: { user: true },
      });
      if (!existing) throw new NotFoundException('Drawing not found');

      if (dto.folderId === null) {
        throw new BadRequestException('Drawing must belong to a folder.');
      }

      await drawings.update(
        { id, user: { id: userId } as any },
        {
          name: dto.name,
          width: dto.width,
          height: dto.height,
          thumbnailUrl: dto.thumbnailUrl ?? undefined,
          colors: dto.colors ?? undefined,
          ...(dto.folderId ? { folder: { id: dto.folderId } as any } : {}),
        },
      );

      if (dto.layers !== undefined) {
        await layers.delete({ drawing: { id } });

        if (dto.layers.length > 0) {
          await layers.save(
            dto.layers.map((l) =>
              layers.create({
                id: l.id,
                drawing: { id } as any,
                name: l.name,
                zIndex: l.zIndex,
                visible: l.visible ?? true,
                opacity: l.opacity ?? 1,
                canvasData: l.canvasData ?? null,
              }),
            ),
          );
        }
      }

      return drawings.findOneOrFail({
        where: { id, user: { id: userId } },
        relations: { layers: true, folder: true, user: true },
        order: { layers: { zIndex: 'DESC' } },
      });
    });
  }

  async delete(userId: string, id: string) {
    const res = await this.drawingRepository.delete({
      id,
      user: { id: userId } as any,
    });
    if (!res.affected) throw new NotFoundException('Drawing not found');
    return { success: true };
  }
}
