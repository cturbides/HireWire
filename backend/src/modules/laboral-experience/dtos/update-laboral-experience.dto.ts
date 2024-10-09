import { DateFieldOptional, NumberFieldOptional, StringFieldOptional } from '../../../decorators';

export class UpdateLaboralExperienceDto {
  @NumberFieldOptional({ int: false, isPositive: true })
  salary!: number;

  @StringFieldOptional()
  position!: string;

  @StringFieldOptional()
  company!: string;

  @DateFieldOptional()
  startDate!: Date;

  @DateFieldOptional()
  endDate!: Date;
}
