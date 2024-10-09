import { DateFieldOptional, EnumFieldOptional, StringFieldOptional } from '../../../decorators';
import { EducationLevel } from '../../../constants/education-level.enum';

export class UpdateEducationDto {
  @StringFieldOptional()
  description!: string;

  @EnumFieldOptional(() => EducationLevel)
  level!: EducationLevel;

  @DateFieldOptional()
  startDate!: Date;

  @DateFieldOptional()
  endDate!: Date;

  @StringFieldOptional()
  institution!: string;
}
