import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { SkillRepository } from '../skill.repository';

export class GetSkillQuery implements ICommand {
  constructor(public readonly skillId: Uuid) {}
}

@QueryHandler(GetSkillQuery)
export class GetSkillHandler implements IQueryHandler<GetSkillQuery> {
  constructor(private skillRepository: SkillRepository) {}

  async execute(query: GetSkillQuery) {
    return this.skillRepository.find({
      id: query.skillId,
    });
  }
}
