import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { SkillEntity } from '../skill.entity';
import { StringFieldOptional, BooleanFieldOptional } from '../../../decorators';

export class SkillDto extends AbstractDto {
  @ApiPropertyOptional()
  @StringFieldOptional()
  description!: string | null;

  @BooleanFieldOptional()
  @ApiPropertyOptional()
  state: boolean;

  constructor(entityName: SkillEntity) {
    super(entityName);

    this.description = entityName.description;
    this.state = entityName.state;
  }
}
