import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { AutoPartEntity } from './entities/auto-part.entity';
import { CreatePartDto } from '../dto/create-part.dto';
import { UpdatePartDto } from '../dto/update-part.dto';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(AutoPartEntity)
    private readonly partsRepository: Repository<AutoPartEntity>,
  ) { }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: AutoPartEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [data, total] = await this.partsRepository.findAndCount({
      where: search ? { title: ILike(`%${search}%`) } : {},
      order: { createdAt: 'DESC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async findOne(id: string): Promise<AutoPartEntity> {
    const part = await this.partsRepository.findOneBy({ id });

    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    return part;
  }

  async create(dto: CreatePartDto): Promise<AutoPartEntity> {
    const part = this.partsRepository.create(dto);
    return this.partsRepository.save(part);
  }

  async update(
    id: string,
    dto: UpdatePartDto,
  ): Promise<AutoPartEntity> {
    const part = await this.findOne(id);

    Object.assign(part, dto);

    return this.partsRepository.save(part);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.partsRepository.softDelete(id);

    return { message: 'Part deleted successfully' };
  }

  async restore(id: string): Promise<{ message: string }> {
    const result = await this.partsRepository.restore(id);

    if (!result.affected) {
      throw new NotFoundException(
        `Deleted part with ID ${id} not found`,
      );
    }

    return { message: 'Part restored successfully' };
  }
}