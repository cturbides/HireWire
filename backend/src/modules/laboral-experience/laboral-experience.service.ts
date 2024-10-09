import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateLaboralExperienceCommand } from './commands/create-laboral-experience.command';
import type { LaboralExperienceDto } from './dtos/laboral-experience.dto';
import type { LaboralExperiencePageOptionsDto } from './dtos/laboral-experience-page-options.dto';
import { LaboralExperienceNotFoundException } from './exceptions/laboral-experience-not-found.exception';
import { LaboralExperienceEntity } from './laboral-experience.entity';
import { CreateLaboralExperienceDto } from './dtos/create-laboral-experience.dto';
import type { UpdateLaboralExperienceDto } from './dtos/update-laboral-experience.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserIsDisabledException } from './exceptions/user-is-disabled.exception';
import { UserDto } from '../user/dtos/user.dto';
import { InvalidUserIdException } from './exceptions/invalid-user-id.exception';
import { RoleType } from '../../constants/role-type';

@Injectable()
export class LaboralExperienceService {
  constructor(
    private commandBus: CommandBus,
    private userService: UserService,
    @InjectRepository(LaboralExperienceEntity)
    private laboralExperienceRepository: Repository<LaboralExperienceEntity>,
  ) { }

  @Transactional()
  async createLaboralExperience(userDto: UserDto, createLaboralExperienceDto: CreateLaboralExperienceDto): Promise<LaboralExperienceEntity> {
    const user = await this.userService.getUser(createLaboralExperienceDto.userId as Uuid);

    if (!user.state) {
      throw new UserIsDisabledException();
    }

    if (user.id !== userDto.id && userDto.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    return this.commandBus.execute<CreateLaboralExperienceCommand, LaboralExperienceEntity>(
      new CreateLaboralExperienceCommand(createLaboralExperienceDto),
    );
  }

  async getAllEnabledLaboralExperience(user: UserDto, laboralExperiencePageOptionsDto: LaboralExperiencePageOptionsDto): Promise<PageDto<LaboralExperienceDto>> {
    const queryBuilder = this.laboralExperienceRepository
      .createQueryBuilder('laboralExperience')
      .leftJoinAndSelect('laboralExperience.user', 'user')
      .where('laboralExperience.state = :state', { state: true })
      .andWhere('applicant.user.id = :userId', { userId: user.id });

    queryBuilder.orderBy(`laboralExperience.${laboralExperiencePageOptionsDto.sort}`, laboralExperiencePageOptionsDto.order);

    const [items, pageMetaDto] = await queryBuilder.paginate(laboralExperiencePageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllLaboralExperience(
    laboralExperiencePageOptionsDto: LaboralExperiencePageOptionsDto,
  ): Promise<PageDto<LaboralExperienceDto>> {
    const queryBuilder = this.laboralExperienceRepository
      .createQueryBuilder('laboralExperience')
      .leftJoinAndSelect('laboralExperience.user', 'user');

    queryBuilder.orderBy(`laboralExperience.${laboralExperiencePageOptionsDto.sort}`, laboralExperiencePageOptionsDto.order);

    const [items, pageMetaDto] = await queryBuilder.paginate(laboralExperiencePageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleLaboralExperience(user: UserDto, id: Uuid): Promise<LaboralExperienceEntity> {
    const queryBuilder = this.laboralExperienceRepository
      .createQueryBuilder('laboralExperience')
      .leftJoinAndSelect('laboralExperience.user', 'user')
      .where('laboralExperience.id = :id', { id });

    const laboralExperienceEntity = await queryBuilder.getOne();

    if (!laboralExperienceEntity) {
      throw new LaboralExperienceNotFoundException();
    }

    if (laboralExperienceEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    return laboralExperienceEntity;
  }

  async updateLaboralExperience(
    id: Uuid,
    user: UserDto,
    updateLaboralExperienceDto: UpdateLaboralExperienceDto,
  ): Promise<void> {
    const queryBuilder = this.laboralExperienceRepository
      .createQueryBuilder('laboralExperience')
      .leftJoinAndSelect('laboralExperience.user', 'user')
      .where('laboralExperience.id = :id', { id });

    const laboralExperienceEntity = await queryBuilder.getOne();

    if (!laboralExperienceEntity) {
      throw new LaboralExperienceNotFoundException();
    }

    if (laboralExperienceEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    await this.laboralExperienceRepository.save({
      ...laboralExperienceEntity,
      ...updateLaboralExperienceDto,
      user: {
        id: user.id,
      },
      id: laboralExperienceEntity.id,
      startDate: new Date(updateLaboralExperienceDto.startDate || laboralExperienceEntity.startDate),
      endDate: new Date(updateLaboralExperienceDto.endDate || laboralExperienceEntity.endDate)
    });
  }

  async activateLaboralExperience(id: Uuid): Promise<void> {
    const queryBuilder = this.laboralExperienceRepository
      .createQueryBuilder('laboralExperience')
      .leftJoinAndSelect('laboralExperience.user', 'user')
      .where('laboralExperience.id = :id', { id });

    const laboralExperienceEntity = await queryBuilder.getOne();

    if (!laboralExperienceEntity) {
      throw new LaboralExperienceNotFoundException();
    }

    await this.laboralExperienceRepository.save({
      state: true,
      id: laboralExperienceEntity.id,
    });
  }

  async deleteLaboralExperience(id: Uuid, user: UserDto): Promise<void> {
    const queryBuilder = this.laboralExperienceRepository
      .createQueryBuilder('laboralExperience')
      .leftJoinAndSelect('laboralExperience.user', 'user')
      .where('laboralExperience.id = :id', { id });

    const laboralExperienceEntity = await queryBuilder.getOne();

    if (!laboralExperienceEntity) {
      throw new LaboralExperienceNotFoundException();
    }

    if (laboralExperienceEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    await this.laboralExperienceRepository.save({
      id: laboralExperienceEntity.id,
      state: false,
    });
  }
}
