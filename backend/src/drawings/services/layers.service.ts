import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Layer } from '../models/entities/layer.entity';
import { CreateLayerDto, UpdateLayerDto } from '../models/dtos/layer.dto';
import { Drawing } from '../models/entities/drawing.entity';

@Injectable()
export class LayersService {
  constructor(
    @InjectRepository(Layer) private layersRepository: Repository<Layer>,
    @InjectRepository(Drawing) private drawingsRepository: Repository<Drawing>,
  ) {}

  public getAll(userId: string, drawingId?: string) {
    const where: any = { drawing: { user: { id: userId } } };
    if (drawingId) where.drawing.id = drawingId;
    return this.layersRepository.find({
      where,
      order: { zIndex: 'DESC' },
      select: {
        id: true,
        name: true,
        zIndex: true,
        visible: true,
        opacity: true,
        canvasData: true,
      },
    });
  }

  public async getById(userId: string, id: string) {
    const layer = await this.layersRepository.findOne({
      where: { id, drawing: { user: { id: userId } } },
      relations: { drawing: true },
    });
    if (!layer) throw new NotFoundException('Layer not found');
    return layer;
  }

  public async create(userId: string, dto: CreateLayerDto) {
    const drawing = await this.drawingsRepository.findOne({
      where: { id: dto.drawingId, user: { id: userId } },
      select: { id: true },
    });
    if (!drawing) throw new NotFoundException('Drawing not found');
    const layer = this.layersRepository.create({
      name: dto.name,
      zIndex: dto.zIndex,
      visible: dto.visible ?? true,
      opacity: dto.opacity ?? 1,
      canvasData: dto.canvasData ?? undefined,
      drawing: { id: drawing.id } as any,
    });
    return this.layersRepository.save(layer);
  }

  public async update(userId: string, id: string, dto: UpdateLayerDto) {
    const patch: any = {
      name: dto.name,
      visible: dto.visible,
      opacity: dto.opacity,
      zIndex: dto.zIndex,
      canvasData:
        dto.canvasData === null ? null : (dto.canvasData ?? undefined),
    };
    const res = await this.layersRepository.update(
      { id, drawing: { user: { id: userId } } as any },
      patch,
    );
    if (!res.affected) throw new NotFoundException('Layer not found');
    return this.getById(userId, id);
  }

  public async delete(userId: string, id: string) {
    const res = await this.layersRepository.delete({
      id,
      drawing: { user: { id: userId } } as any,
    });
    if (!res.affected) throw new NotFoundException('Layer not found');
    return { success: true };
  }
}
