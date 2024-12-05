import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreatePositionCommand } from './commands/create-position.command';
import type { PositionDto } from './dtos/position.dto';
import { PositionPageOptionsDto } from './dtos/position-page-options.dto';
import { PositionNotFoundException } from './exceptions/position-not-found.exception';
import { PositionEntity } from './position.entity';
import { CreatePositionDto } from './dtos/create-position.dto';
import type { UpdatePositionDto } from './dtos/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinSalaryIsBiggerThanMaxSalaryException } from './exceptions/max-salary-is-bigger-than-min-salary.exception';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  createPosition(
    createPositionDto: CreatePositionDto,
  ): Promise<PositionEntity> {
    if (createPositionDto.maxSalary < createPositionDto.minSalary) {
      throw new MinSalaryIsBiggerThanMaxSalaryException();
    }

    return this.commandBus.execute<CreatePositionCommand, PositionEntity>(
      new CreatePositionCommand(createPositionDto),
    );
  }

  async getAllAvailablePosition(
    positionPageOptionsDto: PositionPageOptionsDto,
  ): Promise<PageDto<PositionDto>> {
    const queryBuilder = this.positionRepository
      .createQueryBuilder('position')
      .where('position.available = :available', { available: true })
      .andWhere('position.state = :state', { state: true });

    queryBuilder.orderBy(
      `position.${positionPageOptionsDto.sort}`,
      positionPageOptionsDto.order,
    );

    const [items, pageMetaDto] = await queryBuilder.paginate(
      positionPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getAllPosition(
    positionPageOptionsDto: PositionPageOptionsDto,
  ): Promise<PageDto<PositionDto>> {
    const queryBuilder = this.positionRepository.createQueryBuilder('position');

    queryBuilder.orderBy(
      `position.${positionPageOptionsDto.sort}`,
      positionPageOptionsDto.order,
    );

    const [items, pageMetaDto] = await queryBuilder.paginate(
      positionPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getSinglePosition(id: Uuid): Promise<PositionEntity> {
    const queryBuilder = this.positionRepository
      .createQueryBuilder('position')
      .where('position.id = :id', { id });

    const positionEntity = await queryBuilder.getOne();

    if (!positionEntity) {
      throw new PositionNotFoundException();
    }

    return positionEntity;
  }

  async updatePosition(
    id: Uuid,
    updatePositionDto: UpdatePositionDto,
  ): Promise<void> {
    const queryBuilder = this.positionRepository
      .createQueryBuilder('position')
      .where('position.id = :id', { id });

    const positionEntity = await queryBuilder.getOne();

    if (!positionEntity) {
      throw new PositionNotFoundException();
    }

    if (
      updatePositionDto.minSalary &&
      updatePositionDto.minSalary > positionEntity.maxSalary
    ) {
      throw new MinSalaryIsBiggerThanMaxSalaryException();
    }

    if (
      updatePositionDto.maxSalary &&
      updatePositionDto.maxSalary < positionEntity.minSalary
    ) {
      throw new MinSalaryIsBiggerThanMaxSalaryException();
    }

    await this.positionRepository.save({
      ...positionEntity,
      ...updatePositionDto,
      id: positionEntity.id,
    });
  }

  async activatePosition(id: Uuid): Promise<void> {
    const queryBuilder = this.positionRepository
      .createQueryBuilder('position')
      .where('position.id = :id', { id });

    const positionEntity = await queryBuilder.getOne();

    if (!positionEntity) {
      throw new PositionNotFoundException();
    }

    await this.positionRepository.save({
      state: true,
      id: positionEntity.id,
    });
  }

  async deletePosition(id: Uuid): Promise<void> {
    const queryBuilder = this.positionRepository
      .createQueryBuilder('position')
      .where('position.id = :id', { id });

    const positionEntity = await queryBuilder.getOne();

    if (!positionEntity) {
      throw new PositionNotFoundException();
    }

    await this.positionRepository.save({
      id: positionEntity.id,
      state: false,
      available: true,
    });
  }
}
