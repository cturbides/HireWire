import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import type { CreatePositionDto } from '../dtos/create-position.dto';
import { PositionEntity } from '../position.entity';

export class CreatePositionCommand implements ICommand {
  constructor(
    public readonly createPositionDto: CreatePositionDto,
  ) { }
}

@CommandHandler(CreatePositionCommand)
export class CreatePositionHandler
  implements ICommandHandler<CreatePositionCommand, PositionEntity> {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ) { }

  async execute(command: CreatePositionCommand) {
    const positionEntity = this.positionRepository.create({
      name: command.createPositionDto.name,
      minSalary: command.createPositionDto.minSalary,
      maxSalary: command.createPositionDto.maxSalary,
      riskLevel: command.createPositionDto.riskLevel,
      available: command.createPositionDto.available != undefined ? command.createPositionDto.available : undefined,
      description: command.createPositionDto.description != undefined ? command.createPositionDto.description : undefined,
    });

    await this.positionRepository.save(positionEntity);

    return positionEntity;
  }
}
