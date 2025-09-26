import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing } from './entities/drawing.entity';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectRepository(Drawing) private drawingRepository: Repository<Drawing>,
  ) {}

  public getAll() {
    return this.drawingRepository.find();
  }

  public getById(id: string) {
    return this.drawingRepository.findOne({
      where: { id },
    });
  }
}
