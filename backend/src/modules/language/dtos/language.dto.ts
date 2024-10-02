import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { LanguageEntity } from '../language.entity';
import { StringFieldOptional, BooleanFieldOptional } from '../../../decorators';

export class LanguageDto extends AbstractDto {
  @ApiPropertyOptional()
  @StringFieldOptional()
  description!: string | null;

  @BooleanFieldOptional()
  @ApiPropertyOptional()
  state: boolean;

  constructor(entityName: LanguageEntity) {
    super(entityName);

    this.description = entityName.description;
    this.state = entityName.state;
  }
}
