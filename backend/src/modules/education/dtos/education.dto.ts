import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { EducationEntity } from '../education.entity';
import { UserDto } from '../../user/dtos/user.dto';
import { StringFieldOptional, BooleanFieldOptional, ClassFieldOptional, DateFieldOptional, EnumField, DateField } from '../../../decorators';
import { EducationLevel } from '../../../constants/education-level.enum';

export class EducationDto extends AbstractDto {
  @BooleanFieldOptional()
  @ApiPropertyOptional()
  state: boolean;

  @ApiProperty()
  @ClassFieldOptional(() => UserDto)
  user!: UserDto;

  @StringFieldOptional()
  @ApiProperty()
  description!: string;

  @EnumField(() => EducationLevel)
  @ApiProperty()
  level!: EducationLevel;

  @DateField()
  @ApiProperty()
  startDate!: Date;

  @DateFieldOptional()
  @ApiProperty()
  endDate!: Date;

  @StringFieldOptional()
  @ApiProperty()
  institution!: string;

  constructor(entityName: EducationEntity) {
    super(entityName);

    this.user = entityName.user.toDto()

    this.state = entityName.state;
    this.description = entityName.description;
    this.level = entityName.level;
    this.startDate = entityName.startDate;
    this.endDate = entityName.endDate;
    this.institution = entityName.institution;
  }
}
