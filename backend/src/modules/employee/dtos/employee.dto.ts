import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { EmployeeEntity } from '../employee.entity';
import { UserDto } from '../../user/dtos/user.dto';
import { PositionDto } from '../../position/dtos/position.dto';
import { StringFieldOptional, BooleanFieldOptional, NumberFieldOptional, ClassFieldOptional, DateFieldOptional } from '../../../decorators';

export class EmployeeDto extends AbstractDto {
  @BooleanFieldOptional()
  @ApiPropertyOptional()
  state: boolean;

  @ApiProperty()
  @ClassFieldOptional(() => UserDto)
  user!: UserDto;

  @ApiProperty()
  @ClassFieldOptional(() => PositionDto)
  position!: PositionDto;

  @ApiProperty()
  @NumberFieldOptional({ int: false, isPositive: true })
  mensualSalary!: number;

  @ApiProperty()
  @StringFieldOptional()
  department!: string;

  @ApiProperty()
  @StringFieldOptional()
  documentId!: string;

  @ApiProperty()
  @DateFieldOptional()
  joinDate!: Date;

  constructor(entityName: EmployeeEntity) {
    super(entityName);

    this.user = entityName.user.toDto()
    this.position = entityName.position.toDto();

    this.state = entityName.state;
    this.joinDate = entityName.joinDate;
    this.department = entityName.department;
    this.documentId = entityName.documentId;
    this.mensualSalary = entityName.mensualSalary;
  }
}
