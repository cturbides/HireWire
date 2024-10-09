import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateSkillCommand } from './commands/create-skill.command';
import type { SkillDto } from './dtos/skill.dto';
import type { SkillPageOptionsDto } from './dtos/skill-page-options.dto';
import { SkillNotFoundException } from './exceptions/skill-not-found.exception';
import { SkillEntity } from './skill.entity';
import { CreateSkillDto } from './dtos/create-skill.dto';
import type { UpdateSkillDto } from './dtos/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
    private commandBus: CommandBus,
  ) { }

  @Transactional()
  createSkill(createSkillDto: CreateSkillDto): Promise<SkillEntity> {
    return this.commandBus.execute<CreateSkillCommand, SkillEntity>(
      new CreateSkillCommand(createSkillDto),
    );
  }

  async getAllEnabledSkill(skillPageOptionsDto: SkillPageOptionsDto): Promise<PageDto<SkillDto>> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.state = :state', { state: true });

    const [items, pageMetaDto] = await queryBuilder.paginate(skillPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllSkill(
    skillPageOptionsDto: SkillPageOptionsDto,
  ): Promise<PageDto<SkillDto>> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill');

    queryBuilder.orderBy(`skill.${skillPageOptionsDto.sort}`, skillPageOptionsDto.order);

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

    await this.skillRepository.save({
      ...skillEntity,
      ...updateSkillDto,
      id: skillEntity.id,
    });
  }

  async activateSkill(id: Uuid): Promise<void> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.id = :id', { id });

    const skillEntity = await queryBuilder.getOne();

    if (!skillEntity) {
      throw new SkillNotFoundException();
    }

    await this.skillRepository.save({
      state: true,
      id: skillEntity.id,
    });
  }

  async deleteSkill(id: Uuid): Promise<void> {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.id = :id', { id });

    const skillEntity = await queryBuilder.getOne();

    if (!skillEntity) {
      throw new SkillNotFoundException();
    }

    await this.skillRepository.save({
      id: skillEntity.id,
      state: false,
    })
  }
}
