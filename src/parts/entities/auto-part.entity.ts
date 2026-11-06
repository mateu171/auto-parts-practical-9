import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ManyToOne, ManyToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm';
import { CarModelEntity } from './car-model.entity';
import { SpecificationEntity } from './specification.entity';
import { CompatibilityCodeEntity } from './compatibility-code.entity';

@Entity('parts')
export class AutoPartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  price: number;

  @Column({ type: 'varchar', length: 50 })
  oemCode: string;

  @Column({
    type: 'enum',
    enum: ['NEW', 'REFURBISHED'],
  })
  condition: 'NEW' | 'REFURBISHED';

  @Column({ type: 'varchar', length: 80 })
  carBrand: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => CarModelEntity, (carModel) => carModel.parts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  carModel: CarModelEntity;

  @ManyToMany(() => SpecificationEntity, (specification) => specification.parts, {
    cascade: true,
  })
  @JoinTable()
  specifications: SpecificationEntity[];

  @OneToOne(() => CompatibilityCodeEntity, (code) => code.part, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  compatibilityCode: CompatibilityCodeEntity;
}