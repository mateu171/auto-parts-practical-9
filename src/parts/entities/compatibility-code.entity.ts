import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AutoPartEntity } from './auto-part.entity';

@Entity('compatibility_codes')
export class CompatibilityCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @OneToOne(() => AutoPartEntity, (part) => part.compatibilityCode)
  part: AutoPartEntity;
}