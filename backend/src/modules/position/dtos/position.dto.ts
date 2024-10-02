import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { PositionEntity } from '../position.entity';
import { StringFieldOptional, BooleanFieldOptional, NumberFieldOptional, EnumFieldOptional } from '../../../decorators';
import { RiskLevel } from '../../../constants/risk-level';

export class PositionDto extends AbstractDto {
  @ApiProperty()
  @StringFieldOptional()
  name!: string | null;

  @BooleanFieldOptional()
  @ApiPropertyOptional()
  state: boolean;

  @ApiProperty()
  @NumberFieldOptional()
  minSalary!: number;

  @ApiProperty()
  @NumberFieldOptional()
  maxSalary!: number;

  @ApiProperty()
  @EnumFieldOptional(() => RiskLevel)
  riskLevel!: RiskLevel;

  @ApiProperty()
  @BooleanFieldOptional()
  available!: boolean;

  @ApiPropertyOptional()
  @StringFieldOptional()
  description!: string;


  constructor(entityName: PositionEntity) {
    super(entityName);

    this.name = entityName.name;
    this.state = entityName.state;
    this.minSalary = entityName.minSalary;
    this.maxSalary = entityName.maxSalary;
    this.riskLevel = entityName.riskLevel;
    this.available  = entityName.available;
    this.description = entityName.description;
  }
}
