import { Injectable, NotFoundException } from '@nestjs/common';
import { Layer } from './models/layer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLayerDto, UpdateLayerDto } from './models/layer.dto';

@Injectable()
export class LayersService {
  constructor(
    @InjectRepository(Layer) private layersRepository: Repository<Layer>,
  ) {}

  public getAll(drawingId?: string) {
    const where: any = {};
    if (drawingId) where.drawing = { id: drawingId };
    return this.layersRepository.find({
      where,
      order: { zIndex: 'DESC' },
      relations: [],
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

  public async getById(id: string) {
    const layer = await this.layersRepository.findOne({
      where: { id },
      relations: { drawing: true },
    });
    if (!layer) throw new NotFoundException('Layer not found');
    return layer;
  }

  public async create(dto: CreateLayerDto) {
    const layer = this.layersRepository.create({
      name: dto.name,
      zIndex: dto.zIndex,
      visible: dto.visible ?? true,
      opacity: dto.opacity ?? 1,
      canvasData: dto.canvasData ?? undefined,
      drawing: { id: dto.drawingId } as any,
    });
    return await this.layersRepository.save(layer);
  }

  public async update(id: string, dto: UpdateLayerDto) {
    const patch: any = {
      name: dto.name,
      visible: dto.visible,
      opacity: dto.opacity,
      zIndex: dto.zIndex,
      bitmapUrl: dto.canvasData === null ? null : (dto.canvasData ?? undefined),
    };
    await this.layersRepository.update(id, patch);
    return this.getById(id);
  }

  public delete(id: string) {
    return this.layersRepository.delete(id);
  }
}
