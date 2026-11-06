import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { AutoPartEntity } from './auto-part.entity';

@Entity('specifications')
export class SpecificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => AutoPartEntity, (part) => part.specifications)
  parts: AutoPartEntity[];
}