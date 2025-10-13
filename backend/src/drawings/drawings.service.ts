import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing } from './models/drawing.entity';
import { CreateDrawingDto, UpdateDrawingDto } from './models/drawing.dto';
import { Layer } from './models/layer.entity';
import { SaveDto, SaveLayerDto } from './models/save.dto';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectRepository(Drawing) private drawingRepository: Repository<Drawing>,
    @InjectRepository(Layer) private layersRepository: Repository<Layer>,
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

  public async save(id: string, dto: SaveDto) {
    const drawingPatch: any = {
      name: dto.name,
      width: dto.width,
      height: dto.height,
      thumbnailUrl: dto.thumbnailUrl ?? undefined,
      colors: dto.colors ?? undefined,
    };

    if (dto.folderId === null) {
      drawingPatch.folder = null;
    } else if (dto.folderId) {
      drawingPatch.folder = { id: dto.folderId } as any;
    }

    await this.drawingRepository.update(id, drawingPatch);

    if (dto.layers && dto.layers.length > 0) {
      await this.updateLayers(id, dto.layers);
    }

    return this.getById(id);
  }

  private async updateLayers(drawingId: string, layerDtos: SaveLayerDto[]) {
    const existingLayers = await this.layersRepository.find({
      where: { drawing: { id: drawingId } },
    });

    const existingById = new Map(existingLayers.map((l) => [l.id, l]));

    const layersToUpdate: Layer[] = [];
    const layersToCreate: Layer[] = [];
    const keptIds = new Set<string>();

    for (const dto of layerDtos) {
      const found = dto.id ? existingById.get(dto.id) : undefined;

      if (found) {
        found.name = dto.name;
        found.zIndex = dto.zIndex;
        found.visible = dto.visible ?? true;
        found.opacity = dto.opacity ?? 1;
        // allow explicit null to clear, undefined = keep
        found.canvasData =
          dto.canvasData === null ? null : (dto.canvasData ?? found.canvasData);
        layersToUpdate.push(found);
        keptIds.add(found.id);
      } else {
        // Either no id or id not in DB → create
        const newLayer = this.layersRepository.create({
          drawing: { id: drawingId } as any,
          name: dto.name,
          zIndex: dto.zIndex,
          visible: dto.visible ?? true,
          opacity: dto.opacity ?? 1,
          canvasData: dto.canvasData ?? undefined,
        });
        layersToCreate.push(newLayer);
      }
    }

    const layersToDelete = existingLayers.filter((l) => !keptIds.has(l.id));

    await Promise.all([
      layersToUpdate.length
        ? this.layersRepository.save(layersToUpdate)
        : Promise.resolve(),
      layersToCreate.length
        ? this.layersRepository.save(layersToCreate)
        : Promise.resolve(),
      layersToDelete.length
        ? this.layersRepository.remove(layersToDelete)
        : Promise.resolve(),
    ]);
  }

  public delete(id: string) {
    return this.drawingRepository.delete(id);
  }
}
