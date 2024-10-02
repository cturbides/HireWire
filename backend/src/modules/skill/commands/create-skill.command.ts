import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { find } from 'lodash';

import type { CreateSkillDto } from '../dtos/create-skill.dto';
import type { SkillEntity } from '../skill.entity';
import { SkillRepository } from '../skill.repository';
import type { SkillTranslationEntity } from '../skill-translation.entity';
import { SkillTranslationRepository } from '../skill-translation.repository';

export class CreateSkillCommand implements ICommand {
  constructor(
    public readonly createSkillDto: CreateSkillDto,
  ) {}
}

@CommandHandler(CreateSkillCommand)
export class CreateSkillHandler
  implements ICommandHandler<CreateSkillCommand, SkillEntity>
{
  constructor(
    private skillRepository: SkillRepository,
    private skillTranslationRepository: SkillTranslationRepository,
  ) {}

  async execute(command: CreateSkillCommand) {
    const { createSkillDto } = command;
    const skillEntity = this.skillRepository.create();
    const translations: SkillTranslationEntity[] = [];

    await this.skillRepository.save(skillEntity);

    // FIXME: Create generic function for translation creation
    for (const createTranslationDto of createSkillDto.title) {
      const languageCode = createTranslationDto.languageCode;
      const translationEntity = this.skillTranslationRepository.create({
        skillId: skillEntity.id,
        languageCode,
        title: createTranslationDto.text,
        description: find(createSkillDto.description, {
          languageCode,
        })!.text,
      });

      translations.push(translationEntity);
    }

    await this.skillTranslationRepository.save(translations);

    skillEntity.translations = translations;

    return skillEntity;
  }
}
