import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { LaboralExperienceEntity } from '../laboral-experience.entity';

export class GetLaboralExperienceQuery implements ICommand {
  constructor(public readonly laboralExperienceId: Uuid) { }
}

@QueryHandler(GetLaboralExperienceQuery)
export class GetLaboralExperienceHandler implements IQueryHandler<GetLaboralExperienceQuery> {
  constructor(
    @InjectRepository(LaboralExperienceEntity)
    private laboralExperienceRepository: Repository<LaboralExperienceEntity>
  ) { }

  async execute(query: GetLaboralExperienceQuery) {
    return this.laboralExperienceRepository.find({
      where: {
        id: query.laboralExperienceId
      }
    });
  }
}
