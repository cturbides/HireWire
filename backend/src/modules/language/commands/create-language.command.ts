import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import type { CreateLanguageDto } from '../dtos/create-language.dto';
import { LanguageEntity } from '../language.entity';

export class CreateLanguageCommand implements ICommand {
  constructor(
    public readonly createLanguageDto: CreateLanguageDto,
  ) { }
}

@CommandHandler(CreateLanguageCommand)
export class CreateLanguageHandler
  implements ICommandHandler<CreateLanguageCommand, LanguageEntity> {
  constructor(
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
  ) { }

  async execute(command: CreateLanguageCommand) {
    const languageEntity = this.languageRepository.create({ description: command.createLanguageDto.description });

    await this.languageRepository.save(languageEntity);

    return languageEntity;
  }
}
