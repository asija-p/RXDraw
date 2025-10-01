import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Drawing } from './drawing.entity';

@Entity('layers')
export class Layer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Drawing, (d) => d.layers, { onDelete: 'CASCADE' })
  drawing: Drawing;

  @Column({ length: 80 })
  name: string;

  @Column({ type: 'boolean', default: true })
  visible: boolean;

  @Column({ type: 'float', default: 1 })
  opacity: number; // 0..1

  @Index(['drawing', 'zIndex'], { unique: true })
  @Column('int')
  zIndex: number;

  @Column({ type: 'text', nullable: true })
  canvasData?: string; // url to cloudinary
}
