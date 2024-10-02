import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { ApplicantEntity } from '../applicant.entity';

export class GetApplicantQuery implements ICommand {
  constructor(public readonly applicantId: Uuid) { }
}

@QueryHandler(GetApplicantQuery)
export class GetApplicantHandler implements IQueryHandler<GetApplicantQuery> {
  constructor(
    @InjectRepository(ApplicantEntity)
    private applicantRepository: Repository<ApplicantEntity>
  ) { }

  async execute(query: GetApplicantQuery) {
    return this.applicantRepository.find({
      where: {
        id: query.applicantId
      }
    });
  }
}
