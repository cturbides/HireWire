import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { PositionEntity } from '../position.entity';

export class GetPositionQuery implements ICommand {
  constructor(public readonly positionId: Uuid) { }
}

@QueryHandler(GetPositionQuery)
export class GetPositionHandler implements IQueryHandler<GetPositionQuery> {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>
  ) { }

  async execute(query: GetPositionQuery) {
    return this.positionRepository.find({
      where: {
        id: query.positionId
      }
    });
  }
}
