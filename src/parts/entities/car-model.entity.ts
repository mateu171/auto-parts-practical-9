import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AutoPartEntity } from './auto-part.entity';

@Entity('car_models')
export class CarModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  brand: string;

  @OneToMany(() => AutoPartEntity, (part) => part.carModel)
  parts: AutoPartEntity[];
}