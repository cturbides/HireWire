import { DateField, NumberField, StringField, UUIDField } from '../../../decorators';

export class CreateLaboralExperienceDto {
  @UUIDField()
  userId!: string;

  @NumberField({ int: false, isPositive: true })
  salary!: number;

  @StringField()
  company!: string;

  @StringField()
  position!: string;

  @DateField()
  startDate!: Date;

  @DateField()
  endDate!: Date;
}
