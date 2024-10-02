import { EntityRepository, Repository } from 'typeorm';

import { SkillEntity } from './skill.entity';

@EntityRepository(SkillEntity)
export class SkillRepository extends Repository<SkillEntity> {}
