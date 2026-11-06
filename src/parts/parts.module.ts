import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsController } from './parts.controller';
import { PartsService } from './parts.service';

import { AutoPartEntity } from './entities/auto-part.entity';
import { CarModelEntity } from './entities/car-model.entity';
import { SpecificationEntity } from './entities/specification.entity';
import { CompatibilityCodeEntity } from './entities/compatibility-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutoPartEntity,
      CarModelEntity,
      SpecificationEntity,
      CompatibilityCodeEntity,
    ]),
  ],
  controllers: [PartsController],
  providers: [PartsService],
})
export class PartsModule {}