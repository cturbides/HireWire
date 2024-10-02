import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import type { CreateSkillDto } from '../dtos/create-skill.dto';
import { SkillEntity } from '../skill.entity';

export class CreateSkillCommand implements ICommand {
  constructor(
    public readonly createSkillDto: CreateSkillDto,
  ) { }
}

@CommandHandler(CreateSkillCommand)
export class CreateSkillHandler
  implements ICommandHandler<CreateSkillCommand, SkillEntity> {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
  ) { }

  async execute(command: CreateSkillCommand) {
    const skillEntity = this.skillRepository.create({ description: command.createSkillDto.description });

    await this.skillRepository.save(skillEntity);

    return skillEntity;
  }
}
