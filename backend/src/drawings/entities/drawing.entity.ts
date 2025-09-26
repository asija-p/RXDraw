import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Layer } from './layer.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('drawings')
export class Drawing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 120 })
  name: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column({ type: 'text', nullable: true })
  thumbnailData?: string;

  @ManyToOne(() => User, (u) => u.drawings, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Layer, (l) => l.drawing, {
    cascade: true,
  })
  layers: Layer[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
