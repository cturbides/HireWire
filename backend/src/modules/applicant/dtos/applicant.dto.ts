import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ApplicantEntity } from '../applicant.entity';
import { UserDto } from '../../user/dtos/user.dto';
import { PositionDto } from '../../position/dtos/position.dto';
import { StringFieldOptional, BooleanFieldOptional, NumberFieldOptional, ClassFieldOptional } from '../../../decorators';

export class ApplicantDto extends AbstractDto {
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
  desiredSalary!: number;

  @ApiProperty()
  @StringFieldOptional()
  recommendedBy!: string;

  constructor(entityName: ApplicantEntity) {
    super(entityName);

    this.state = entityName.state;
    this.user = entityName.user.toDto()
    this.position = entityName.position.toDto();

    this.desiredSalary = entityName.desiredSalary;
    this.recommendedBy = entityName.recommendedBy;
  }
}
