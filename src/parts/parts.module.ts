import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsController } from './parts.controller';
import { PartsService } from './parts.service';
import { AutoPartEntity } from './entities/auto-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AutoPartEntity])],
  controllers: [PartsController],
  providers: [PartsService],
})
export class PartsModule {}