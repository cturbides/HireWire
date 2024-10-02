import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateLanguageCommand } from './commands/create-language.command';
import type { LanguageDto } from './dtos/language.dto';
import type { LanguagePageOptionsDto } from './dtos/language-page-options.dto';
import { LanguageNotFoundException } from './exceptions/language-not-found.exception';
import { LanguageEntity } from './language.entity';
import { CreateLanguageDto } from './dtos/create-language.dto';
import type { UpdateLanguageDto } from './dtos/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    private commandBus: CommandBus,
  ) { }

  @Transactional()
  createLanguage(createLanguageDto: CreateLanguageDto): Promise<LanguageEntity> {
    return this.commandBus.execute<CreateLanguageCommand, LanguageEntity>(
      new CreateLanguageCommand(createLanguageDto),
    );
  }

  async getAllEnabledLanguage(languagePageOptionsDto: LanguagePageOptionsDto): Promise<PageDto<LanguageDto>> {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language')
      .where('language.state = :state', { state: true });

    const [items, pageMetaDto] = await queryBuilder.paginate(languagePageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllLanguage(
    languagePageOptionsDto: LanguagePageOptionsDto,
  ): Promise<PageDto<LanguageDto>> {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language');

    const [items, pageMetaDto] = await queryBuilder.paginate(languagePageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleLanguage(id: Uuid): Promise<LanguageEntity> {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language')
      .where('language.id = :id', { id });

    const languageEntity = await queryBuilder.getOne();

    if (!languageEntity) {
      throw new LanguageNotFoundException();
    }

    return languageEntity;
  }

  async updateLanguage(
    id: Uuid,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<void> {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language')
      .where('language.id = :id', { id });

    const languageEntity = await queryBuilder.getOne();

    if (!languageEntity) {
      throw new LanguageNotFoundException();
    }

    await this.languageRepository.save({
      ...languageEntity,
      ...updateLanguageDto,
      id: languageEntity.id,
    });
  }

  async activateLanguage(id: Uuid): Promise<void> {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language')
      .where('language.id = :id', { id });

    const languageEntity = await queryBuilder.getOne();

    if (!languageEntity) {
      throw new LanguageNotFoundException();
    }

    await this.languageRepository.save({
      state: true,
      id: languageEntity.id,
    });
  }

  async deleteLanguage(id: Uuid): Promise<void> {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language')
      .where('language.id = :id', { id });

    const languageEntity = await queryBuilder.getOne();

    if (!languageEntity) {
      throw new LanguageNotFoundException();
    }

    await this.languageRepository.save({
      id: languageEntity.id,
      state: false,
    })
  }
}
