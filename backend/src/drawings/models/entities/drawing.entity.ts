import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/models/user.entity';
import { Folder } from 'src/folders/models/folder.entity';
import { Layer } from './layer.entity';

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
  thumbnailUrl: string | null;

  @ManyToOne(() => User, (u) => u.drawings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Folder, (f) => f.drawings, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  folder?: Folder;

  @OneToMany(() => Layer, (l) => l.drawing)
  layers: Layer[];

  @Column({ type: 'jsonb', default: () => `'[]'` })
  colors: (string | null)[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
