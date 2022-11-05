import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UnauthorizedException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ILike } from 'typeorm';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createBookDto: CreateBookDto) {
    createBookDto.authorId = req.user.id;
    return this.booksService.create(createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req,
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.booksService.findAll(
      {
        name: query ? ILike(`%${query}%`) : undefined,
      },
      {
        limit,
        page,
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (book.authorId !== req.user.id) {
      throw new UnauthorizedException(`You don't have permission`);
    }
    return this.booksService.update(id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (book.authorId !== req.user.id) {
      throw new UnauthorizedException(`You don't have permission`);
    }
    return this.booksService.remove(id);
  }
}
