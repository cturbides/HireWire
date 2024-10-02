import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { LanguageEntity } from '../language.entity';

export class GetLanguageQuery implements ICommand {
  constructor(public readonly languageId: Uuid) { }
}

@QueryHandler(GetLanguageQuery)
export class GetLanguageHandler implements IQueryHandler<GetLanguageQuery> {
  constructor(
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>
  ) { }

  async execute(query: GetLanguageQuery) {
    return this.languageRepository.find({
      where: {
        id: query.languageId
      }
    });
  }
}
