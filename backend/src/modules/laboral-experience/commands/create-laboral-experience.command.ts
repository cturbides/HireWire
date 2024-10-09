import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import type { CreateLaboralExperienceDto } from '../dtos/create-laboral-experience.dto';
import { LaboralExperienceEntity } from '../laboral-experience.entity';

export class CreateLaboralExperienceCommand implements ICommand {
  constructor(
    public readonly createLaboralExperienceDto: CreateLaboralExperienceDto,
  ) { }
}

@CommandHandler(CreateLaboralExperienceCommand)
export class CreateLaboralExperienceHandler
  implements ICommandHandler<CreateLaboralExperienceCommand, LaboralExperienceEntity> {
  constructor(
    @InjectRepository(LaboralExperienceEntity)
    private laboralExperienceRepository: Repository<LaboralExperienceEntity>,
  ) { }

  async execute(command: CreateLaboralExperienceCommand) {
    const laboralExperienceEntity = this.laboralExperienceRepository.create({
      user: {
        id: command.createLaboralExperienceDto.userId,
      },
      company: command.createLaboralExperienceDto.company,
      position: command.createLaboralExperienceDto.position,
      salary: command.createLaboralExperienceDto.salary,
      startDate: command.createLaboralExperienceDto.startDate,
      endDate: command.createLaboralExperienceDto.endDate,
    });

    await this.laboralExperienceRepository.save(laboralExperienceEntity);

    return laboralExperienceEntity;
  }
}
