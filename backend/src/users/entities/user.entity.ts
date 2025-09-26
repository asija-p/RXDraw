import { Drawing } from 'src/drawings/entities/drawing.entity';
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
  @PrimaryGeneratedColumn()
  id: string;

  @Index({ unique: true })
  @Column({ length: 120 })
  name: string;

  @OneToMany(() => Drawing, (d) => d.user)
  drawings: Drawing[];

  @CreateDateColumn() createdAt: Date;
  //@UpdateDateColumn() updatedAt: Date;
}
