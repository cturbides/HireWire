import { RiskLevel } from '../../../constants/risk-level';
import { BooleanFieldOptional, EnumFieldOptional, NumberFieldOptional, StringFieldOptional } from '../../../decorators';

export class UpdatePositionDto {
  @StringFieldOptional()
  name!: string;

  @NumberFieldOptional()
  minSalary!: number;

  @NumberFieldOptional()
  maxSalary!: number;

  @EnumFieldOptional(() => RiskLevel)
  riskLevel!: RiskLevel;

  @BooleanFieldOptional()
  available!: boolean;
}
