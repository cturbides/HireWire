import { DateField, DateFieldOptional, EnumField, StringField, UUIDField } from '../../../decorators';
import { EducationLevel } from '../../../constants/education-level.enum';

export class CreateEducationDto {
  @UUIDField()
  userId!: string;

  @StringField()
  description!: string;

  @EnumField(() => EducationLevel)
  level!: EducationLevel;

  @DateField()
  startDate!: Date;

  @DateFieldOptional()
  endDate!: Date;

  @StringField()
  institution!: string;
}
