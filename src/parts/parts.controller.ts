import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePartDto } from '../dto/create-part.dto';
import { UpdatePartDto } from '../dto/update-part.dto';
import { PartsService } from './parts.service';
import { AutoPartEntity } from './entities/auto-part.entity';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post()
  create(@Body() dto: CreatePartDto): Promise<AutoPartEntity> {
    return this.partsService.create(dto);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('search') search?: string,
  ) {
    return this.partsService.findAll(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AutoPartEntity> {
    return this.partsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePartDto,
  ): Promise<AutoPartEntity> {
    return this.partsService.update(id, dto);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string): Promise<{ message: string }> {
    return this.partsService.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.partsService.remove(id);
  }
}