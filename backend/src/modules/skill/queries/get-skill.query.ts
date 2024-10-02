import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { SkillEntity } from '../skill.entity';

export class GetSkillQuery implements ICommand {
  constructor(public readonly skillId: Uuid) { }
}

@QueryHandler(GetSkillQuery)
export class GetSkillHandler implements IQueryHandler<GetSkillQuery> {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>
  ) { }

  async execute(query: GetSkillQuery) {
    return this.skillRepository.find({
      where: {
        id: query.skillId
      }
    });
  }
}
