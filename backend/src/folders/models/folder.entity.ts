import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/models/user.entity';
import { Drawing } from 'src/drawings/models/drawing.entity';

@Entity('folders')
@Unique('UQ_folder_user_name', ['user', 'name'])
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.folders, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon?: string;

  @OneToMany(() => Drawing, (d) => d.folder)
  drawings: Drawing[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
