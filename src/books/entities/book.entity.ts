import { User } from 'src/users/entities/user.entity';
import { Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  genre: string;

  @Column()
  authorId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  @Transform(({ value }) => value.fullName)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
