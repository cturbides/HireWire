import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { LanguageDto } from './dtos/language.dto';

@Entity({ name: 'Languages' })
@UseDto(LanguageDto)
export class LanguageEntity extends AbstractEntity<LanguageDto> {
  @Column({ nullable: true, type: 'varchar' })
  description!: string | null;
}
