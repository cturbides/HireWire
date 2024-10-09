import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import type { CreateEducationDto } from '../dtos/create-education.dto';
import { EducationEntity } from '../education.entity';

export class CreateEducationCommand implements ICommand {
  constructor(
    public readonly createEducationDto: CreateEducationDto,
  ) { }
}

@CommandHandler(CreateEducationCommand)
export class CreateEducationHandler
  implements ICommandHandler<CreateEducationCommand, EducationEntity> {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) { }

  async execute(command: CreateEducationCommand) {
    const educationEntity = this.educationRepository.create({
      user: {
        id: command.createEducationDto.userId,
      },
      institution: command.createEducationDto.institution,
      level: command.createEducationDto.level,
      startDate: command.createEducationDto.startDate,
      description: command.createEducationDto.description,
      endDate: command.createEducationDto.endDate,
    });

    await this.educationRepository.save(educationEntity);

    return educationEntity;
  }
}
