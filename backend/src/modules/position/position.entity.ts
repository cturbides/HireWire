import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { PositionDto } from './dtos/position.dto';
import { RiskLevel } from '../../constants/risk-level';

@Entity({ name: 'Positions' })
@UseDto(PositionDto)
export class PositionEntity extends AbstractEntity<PositionDto> {
  @Column({ nullable: false, type: 'varchar' })
  name!: string | null;

  @Column({ nullable: false, type: 'float' })
  minSalary!: number;

  @Column({ nullable: false, type: 'float' })
  maxSalary!: number;

  @Column({ type: 'enum', enum: RiskLevel, default: RiskLevel.MEDIUM })
  riskLevel!: RiskLevel;

  @Column({ type: 'boolean', nullable: true, default: true })
  available!: boolean;

  @Column({ nullable: true, type: 'varchar'})
  description!: string;
}
