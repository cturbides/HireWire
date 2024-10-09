import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { LaboralExperienceEntity } from '../laboral-experience.entity';
import { UserDto } from '../../user/dtos/user.dto';
import { StringFieldOptional, BooleanFieldOptional, NumberFieldOptional, ClassFieldOptional, DateFieldOptional } from '../../../decorators';

export class LaboralExperienceDto extends AbstractDto {
  @BooleanFieldOptional()
  @ApiPropertyOptional()
  state: boolean;

  @ApiProperty()
  @ClassFieldOptional(() => UserDto)
  user!: UserDto;

  @StringFieldOptional()
  @ApiProperty()
  company!: string; 

  @StringFieldOptional()
  @ApiProperty()
  position!: string;

  @DateFieldOptional()
  @ApiProperty()
  startDate!: Date;

  @DateFieldOptional()
  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  @NumberFieldOptional({ int: false, isPositive: true })
  salary!: number;

  constructor(entityName: LaboralExperienceEntity) {
    super(entityName);

    this.user = entityName.user.toDto()

    this.state = entityName.state;
    this.company = entityName.company;
    this.position = entityName.position;
    this.startDate = entityName.startDate;
    this.endDate = entityName.endDate;
    this.salary = entityName.salary;
  }
}
