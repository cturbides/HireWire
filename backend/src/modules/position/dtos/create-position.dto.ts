import { RiskLevel } from '../../../constants/risk-level';
import { BooleanFieldOptional, EnumField, NumberField, StringField, StringFieldOptional } from '../../../decorators';

export class CreatePositionDto {
  @StringField()
  name!: string;

  @NumberField({ int: false, isPositive: true })
  minSalary!: number;

  @NumberField({ int: false, isPositive: true })
  maxSalary!: number;

  @EnumField(() => RiskLevel)
  riskLevel!: RiskLevel;

  @BooleanFieldOptional()
  available!: boolean;

  @StringFieldOptional()
  description!: string;
}
