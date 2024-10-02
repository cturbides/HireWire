import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateSkillCommand } from './commands/create-skill.command';
import type { SkillDto } from './dtos/skill.dto';
import type { SkillPageOptionsDto } from './dtos/skill-page-options.dto';
import { SkillNotFoundException } from './exceptions/skill-not-found.exception';
import type { SkillEntity } from './skill.entity';
import { SkillRepository } from './skill.repository';
import { CreateSkillDto } from './dtos/create-skill.dto';
import type { UpdateSkillDto } from './dtos/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    private skillRepository: SkillRepository,
    private validatorService: ValidatorService,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  createSkill(createSkillDto: CreateSkillDto): Promise<SkillEntity> {
    return this.commandBus.execute<CreateSkillCommand, SkillEntity>(
      new CreateSkillCommand(createSkillDto),
    );
  }

  async getAllSkill(
    skillPageOptionsDto: SkillPageOptionsDto,
  ): Promise<PageDto<SkillDto>> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.translations', 'skillTranslation');
    const [items, pageMetaDto] = await queryBuilder.paginate(skillPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleSkill(id: Uuid): Promise<SkillEntity> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.id = :id', { id });

    const skillEntity = await queryBuilder.getOne();

    if (!skillEntity) {
      throw new SkillNotFoundException();
    }

    return skillEntity;
  }

  async updateSkill(
    id: Uuid,
    updateSkillDto: UpdateSkillDto,
  ): Promise<void> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.id = :id', { id });

    const skillEntity = await queryBuilder.getOne();

    if (!skillEntity) {
      throw new SkillNotFoundException();
    }

    this.skillRepository.merge(skillEntity, updateSkillDto);

    await this.skillRepository.save(updateSkillDto);
  }

  async deleteSkill(id: Uuid): Promise<void> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.id = :id', { id });

    const skillEntity = await queryBuilder.getOne();

    if (!skillEntity) {
      throw new SkillNotFoundException();
    }

    await this.skillRepository.remove(skillEntity);
  }
}
