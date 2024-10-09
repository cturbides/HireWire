import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { EducationEntity } from '../education.entity';

export class GetEducationQuery implements ICommand {
  constructor(public readonly educationId: Uuid) { }
}

@QueryHandler(GetEducationQuery)
export class GetEducationHandler implements IQueryHandler<GetEducationQuery> {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>
  ) { }

  async execute(query: GetEducationQuery) {
    return this.educationRepository.find({
      where: {
        id: query.educationId
      }
    });
  }
}
