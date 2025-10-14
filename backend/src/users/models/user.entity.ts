import { Drawing } from 'src/drawings/models/entities/drawing.entity';
import { Folder } from 'src/folders/models/folder.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 120 })
  name: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @OneToMany(() => Folder, (d) => d.user)
  folders: Folder[];

  @OneToMany(() => Drawing, (d) => d.user)
  drawings: Drawing[];

  @CreateDateColumn() createdAt: Date;
  //@UpdateDateColumn() updatedAt: Date;
}
