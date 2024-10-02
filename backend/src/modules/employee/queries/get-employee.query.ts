import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../employee.entity';

export class GetEmployeeQuery implements ICommand {
  constructor(public readonly employeeId: Uuid) { }
}

@QueryHandler(GetEmployeeQuery)
export class GetEmployeeHandler implements IQueryHandler<GetEmployeeQuery> {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>
  ) { }

  async execute(query: GetEmployeeQuery) {
    return this.employeeRepository.find({
      where: {
        id: query.employeeId
      }
    });
  }
}
