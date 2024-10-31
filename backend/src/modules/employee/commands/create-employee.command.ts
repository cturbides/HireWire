import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import type { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeEntity } from '../employee.entity';
import { PositionService } from '../../position/position.service';
import { UpdatePositionDto } from '../../position/dtos/update-position.dto';

export class CreateEmployeeCommand implements ICommand {
  constructor(
    public readonly createEmployeeDto: CreateEmployeeDto,
  ) { }
}

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler
  implements ICommandHandler<CreateEmployeeCommand, EmployeeEntity> {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    private positionService: PositionService
  ) { }

  async execute(command: CreateEmployeeCommand) {
    const employeeEntity = this.employeeRepository.create({
      user: {
        id: command.createEmployeeDto.userId,
      },
      position: {
        id: command.createEmployeeDto.positionId,
      },
      joinDate: new Date().toISOString(),
      department: command.createEmployeeDto.department,
      mensualSalary: command.createEmployeeDto.mensualSalary,
    });

    await this.employeeRepository.save(employeeEntity);

    await this.positionService.updatePosition(employeeEntity.position.id, { available: false } as UpdatePositionDto);

    return employeeEntity;
  }
}
