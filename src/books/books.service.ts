import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

interface IPagination {
  page: number;
  limit: number;
}
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  findAll(where: FindOptionsWhere<Book>, pagination: IPagination) {
    return paginate(this.bookRepository, pagination, {
      where,
      relations: ['author'],
    });
  }

  async findOne(id: string) {
    return this.bookRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    const updateInfo = this.bookRepository.create(updateBookDto);
    return this.bookRepository.update(id, updateInfo);
  }

  remove(id: string) {
    return this.bookRepository.delete(id);
  }
}
