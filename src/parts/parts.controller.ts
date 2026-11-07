import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { PartsService } from './parts.service';
import { CreatePartDto } from '../dto/create-part.dto';
import { UpdatePartDto } from '../dto/update-part.dto';
import { CreatePartWithRelationsDto } from '../dto/create-part-with-relations.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) { }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreatePartDto) {
    return this.partsService.create(dto);
  }

  @Roles(Role.ADMIN, Role.MECHANIC)
  @Post('with-relations')
  createWithRelations(@Body() dto: CreatePartWithRelationsDto) {
    return this.partsService.createWithRelations(dto);
  }

  @Public()
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.partsService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      search,
    );
  }

  @Public()
  @Get('by-relations')
  findByRelations(
    @Query('carModelId') carModelId?: string,
    @Query('specificationId') specificationId?: string,
  ) {
    return this.partsService.findByRelations(carModelId, specificationId);
  }

  @Public()
  @Get(':id/with-relations')
  findOneWithRelations(@Param('id', ParseUUIDPipe) id: string) {
    return this.partsService.findOneWithRelations(id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.partsService.restore(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePartDto,
  ) {
    return this.partsService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partsService.remove(id);
  }
}