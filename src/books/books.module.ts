import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
