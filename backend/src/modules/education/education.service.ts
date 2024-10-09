import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateEducationCommand } from './commands/create-education.command';
import type { EducationDto } from './dtos/education.dto';
import type { EducationPageOptionsDto } from './dtos/education-page-options.dto';
import { EducationNotFoundException } from './exceptions/education-not-found.exception';
import { EducationEntity } from './education.entity';
import { CreateEducationDto } from './dtos/create-education.dto';
import type { UpdateEducationDto } from './dtos/update-education.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserIsDisabledException } from './exceptions/user-is-disabled.exception';
import { UserDto } from '../user/dtos/user.dto';
import { InvalidUserIdException } from './exceptions/invalid-user-id.exception';
import { RoleType } from '../../constants/role-type';

@Injectable()
export class EducationService {
  constructor(
    private commandBus: CommandBus,
    private userService: UserService,
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) { }

  @Transactional()
  async createEducation(userDto: UserDto, createEducationDto: CreateEducationDto): Promise<EducationEntity> {
    const user = await this.userService.getUser(createEducationDto.userId as Uuid);

    if (!user.state) {
      throw new UserIsDisabledException();
    }

    if (user.id !== userDto.id && userDto.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    return this.commandBus.execute<CreateEducationCommand, EducationEntity>(
      new CreateEducationCommand(createEducationDto),
    );
  }

  async getAllEnabledEducation(user: UserDto, educationPageOptionsDto: EducationPageOptionsDto): Promise<PageDto<EducationDto>> {
    const queryBuilder = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.user', 'user')
      .where('education.state = :state', { state: true })
      .andWhere('applicant.user.id = :userId', { userId: user.id });

    queryBuilder.orderBy(`education.${educationPageOptionsDto.sort}`, educationPageOptionsDto.order);

    const [items, pageMetaDto] = await queryBuilder.paginate(educationPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllEducation(
    educationPageOptionsDto: EducationPageOptionsDto,
  ): Promise<PageDto<EducationDto>> {
    const queryBuilder = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.user', 'user');

    queryBuilder.orderBy(`education.${educationPageOptionsDto.sort}`, educationPageOptionsDto.order);

    const [items, pageMetaDto] = await queryBuilder.paginate(educationPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleEducation(user: UserDto, id: Uuid): Promise<EducationEntity> {
    const queryBuilder = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.user', 'user')
      .where('education.id = :id', { id });

    const educationEntity = await queryBuilder.getOne();

    if (!educationEntity) {
      throw new EducationNotFoundException();
    }

    if (educationEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    return educationEntity;
  }

  async updateEducation(
    id: Uuid,
    user: UserDto,
    updateEducationDto: UpdateEducationDto,
  ): Promise<void> {
    const queryBuilder = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.user', 'user')
      .where('education.id = :id', { id });

    const educationEntity = await queryBuilder.getOne();

    if (!educationEntity) {
      throw new EducationNotFoundException();
    }

    if (educationEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    await this.educationRepository.save({
      ...educationEntity,
      ...updateEducationDto,
      user: {
        id: user.id,
      },
      id: educationEntity.id,
      startDate: new Date(updateEducationDto.startDate || educationEntity.startDate),
      endDate: new Date(updateEducationDto.endDate || educationEntity.endDate)
    });
  }

  async activateEducation(id: Uuid): Promise<void> {
    const queryBuilder = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.user', 'user')
      .where('education.id = :id', { id });

    const educationEntity = await queryBuilder.getOne();

    if (!educationEntity) {
      throw new EducationNotFoundException();
    }

    await this.educationRepository.save({
      state: true,
      id: educationEntity.id,
    });
  }

  async deleteEducation(id: Uuid, user: UserDto): Promise<void> {
    const queryBuilder = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.user', 'user')
      .where('education.id = :id', { id });

    const educationEntity = await queryBuilder.getOne();

    if (!educationEntity) {
      throw new EducationNotFoundException();
    }

    if (educationEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    await this.educationRepository.save({
      id: educationEntity.id,
      state: false,
    });
  }
}
