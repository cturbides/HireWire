import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { SkillDto } from './dtos/skill.dto';

@Entity({ name: 'Skills' })
@UseDto(SkillDto)
export class SkillEntity extends AbstractEntity<SkillDto> {
  @Column({ nullable: true, type: 'varchar' })
  description!: string | null;

  @Column({ nullable: false, type: 'boolean', default: false })
  official!: boolean | null;
}
