import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, ILike, In } from 'typeorm';

import { AutoPartEntity } from './entities/auto-part.entity';
import { CarModelEntity } from './entities/car-model.entity';
import { SpecificationEntity } from './entities/specification.entity';
import { CompatibilityCodeEntity } from './entities/compatibility-code.entity';

import { CreatePartDto } from '../dto/create-part.dto';
import { UpdatePartDto } from '../dto/update-part.dto';
import { CreatePartWithRelationsDto } from '../dto/create-part-with-relations.dto';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(AutoPartEntity)
    private readonly partsRepository: Repository<AutoPartEntity>,

    private readonly dataSource: DataSource,
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

  async findByRelations(carModelId?: string, specificationId?: string) {
    const query = this.partsRepository
      .createQueryBuilder('part')
      .leftJoinAndSelect('part.carModel', 'carModel')
      .leftJoinAndSelect('part.specifications', 'specification')
      .leftJoinAndSelect('part.compatibilityCode', 'compatibilityCode');

    if (carModelId) {
      query.andWhere('carModel.id = :carModelId', { carModelId });
    }

    if (specificationId) {
      query.andWhere('specification.id = :specificationId', {
        specificationId,
      });
    }

    return query.getMany();
  }

  async createWithRelations(
    dto: CreatePartWithRelationsDto,
  ): Promise<AutoPartEntity> {
    const {
      carModelId,
      specificationIds,
      compatibilityCode,
      simulateError,
      ...partData
    } = dto;

    return this.dataSource.transaction(async (manager) => {
      const carModel = await manager.findOne(CarModelEntity, {
        where: { id: carModelId },
      });

      if (!carModel) {
        throw new NotFoundException('Car model not found');
      }

      const specifications = await manager.find(SpecificationEntity, {
        where: { id: In(specificationIds) },
      });

      if (specifications.length !== specificationIds.length) {
        throw new NotFoundException('One or more specifications not found');
      }

      const codeRepository = manager.getRepository(CompatibilityCodeEntity);
      const code = codeRepository.create({ code: compatibilityCode });
      await codeRepository.save(code);

      const partRepository = manager.getRepository(AutoPartEntity);

      const part = partRepository.create({
        ...partData,
        carModel,
        specifications,
        compatibilityCode: code,
      });

      const savedPart = await partRepository.save(part);

      if (simulateError) {
        throw new BadRequestException('Тестова помилка для перевірки rollback');
      }

      return savedPart;
    });
  }

  async findOneWithRelations(id: string): Promise<AutoPartEntity> {
    const part = await this.partsRepository
      .createQueryBuilder('part')
      .leftJoinAndSelect('part.carModel', 'carModel')
      .leftJoinAndSelect('part.specifications', 'specifications')
      .leftJoinAndSelect('part.compatibilityCode', 'compatibilityCode')
      .where('part.id = :id', { id })
      .getOne();

    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    return part;
  }
}