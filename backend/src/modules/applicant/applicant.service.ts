import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateApplicantCommand } from './commands/create-applicant.command';
import type { ApplicantDto } from './dtos/applicant.dto';
import type { ApplicantPageOptionsDto } from './dtos/applicant-page-options.dto';
import { ApplicantNotFoundException } from './exceptions/applicant-not-found.exception';
import { ApplicantEntity } from './applicant.entity';
import { CreateApplicantDto } from './dtos/create-applicant.dto';
import type { UpdateApplicantDto } from './dtos/update-applicant.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { PositionService } from '../position/position.service';
import { SalaryIsLessThanMinSalaryException } from './exceptions/salary-is-less-than-min-salary.exception';
import { SalaryIsBiggerThanMaxSalaryException } from './exceptions/salary-is-bigger-than-max-salary.exception';
import { PositionDto } from '../position/dtos/position.dto';
import { UserIsDisabledException } from './exceptions/user-is-disabled.exception';
import { PositionIsDisabledException } from './exceptions/position-is-disabled.exception';
import { PositionIsNotAvailableException } from './exceptions/position-is-not-available.exception';
import { UserDto } from '../../modules/user/dtos/user.dto';
import { RoleType } from '../../constants/role-type';
import { InvalidUserIdTryingToCreateApplicantException } from './exceptions/invalid-user-id-trying-to-create-applicant.exception';
import { InvalidUserIdException } from './exceptions/invalid-user-id.exception';

@Injectable()
export class ApplicantService {
  constructor(
    private commandBus: CommandBus,
    private userService: UserService,
    private positionService: PositionService,
    @InjectRepository(ApplicantEntity)
    private applicantRepository: Repository<ApplicantEntity>,
  ) { }

  @Transactional()
  async createApplicant(user: UserDto, createApplicantDto: CreateApplicantDto): Promise<ApplicantEntity> {
    const foundUser = await this.userService.getUser(createApplicantDto.userId as Uuid);
    const position = await this.positionService.getSinglePosition(createApplicantDto.positionId as Uuid);

    if (!foundUser.state) {
      throw new UserIsDisabledException();
    }

    if (foundUser.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdTryingToCreateApplicantException();
    }

    if (!position.state) {
      throw new PositionIsDisabledException();
    }

    if (!position.available) {
      throw new PositionIsNotAvailableException();
    }

    if (createApplicantDto.desiredSalary > position.maxSalary) {
      throw new SalaryIsBiggerThanMaxSalaryException();
    }

    if (createApplicantDto.desiredSalary < position.minSalary) {
      throw new SalaryIsLessThanMinSalaryException();
    }

    return this.commandBus.execute<CreateApplicantCommand, ApplicantEntity>(
      new CreateApplicantCommand(createApplicantDto),
    );
  }

  async getAllEnabledApplicantByUserId(user: UserDto, applicantPageOptionsDto: ApplicantPageOptionsDto): Promise<PageDto<ApplicantDto>> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.state = :state', { state: true })
      .andWhere('applicant.user.id = :userId', { userId: user.id });

    const [items, pageMetaDto] = await queryBuilder.paginate(applicantPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllApplicantByUser(
    user: UserDto,
    applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.user.id = :userId', { userId: user.id });

    const [items, pageMetaDto] = await queryBuilder.paginate(applicantPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllApplicant(
    applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position');

    const [items, pageMetaDto] = await queryBuilder.paginate(applicantPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleApplicant(id: Uuid, user: UserDto): Promise<ApplicantEntity> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.id = :id', { id });

    const applicantEntity = await queryBuilder.getOne();

    if (!applicantEntity) {
      throw new ApplicantNotFoundException();
    }

    if (applicantEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    return applicantEntity;
  }

  async updateApplicant(
    id: Uuid,
    user: UserDto,
    updateApplicantDto: UpdateApplicantDto,
  ): Promise<void> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.id = :id', { id });

    const applicantEntity = await queryBuilder.getOne();

    if (!applicantEntity) {
      throw new ApplicantNotFoundException();
    }

    if (applicantEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    let userId: string = applicantEntity.user.id;
    let positionId: string = applicantEntity.position.id;

    let position: PositionDto = applicantEntity.position.toDto();

    if (updateApplicantDto.userId && updateApplicantDto.userId !== applicantEntity.user.id) {
      const user = await this.userService.getUser(updateApplicantDto.userId as Uuid);

      if (!user.state) {
        throw new UserIsDisabledException();
      }

      userId = user.id;
    }

    if (updateApplicantDto.positionId && updateApplicantDto.positionId !== positionId) {
      position = await this.positionService.getSinglePosition(updateApplicantDto.positionId as Uuid);

      if (!position.state) {
        throw new PositionIsDisabledException();
      }

      if (!position.available) {
        throw new PositionIsNotAvailableException();
      }

      if (applicantEntity.desiredSalary > position.maxSalary) {
        throw new SalaryIsBiggerThanMaxSalaryException();
      }

      if (applicantEntity.desiredSalary < position.minSalary) {
        throw new SalaryIsLessThanMinSalaryException();
      }

      positionId = position.id;
    }


    if (updateApplicantDto.desiredSalary && updateApplicantDto.desiredSalary > position.maxSalary) {
      throw new SalaryIsBiggerThanMaxSalaryException();
    }

    if (updateApplicantDto.desiredSalary && updateApplicantDto.desiredSalary < position.minSalary) {
      throw new SalaryIsLessThanMinSalaryException();
    }

    await this.applicantRepository.save({
      ...applicantEntity,
      ...updateApplicantDto,
      user: {
        id: userId,
      },
      position: {
        id: positionId,
      },
      id: applicantEntity.id,
    });
  }

  async activateApplicant(id: Uuid): Promise<void> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.id = :id', { id });

    const applicantEntity = await queryBuilder.getOne();

    if (!applicantEntity) {
      throw new ApplicantNotFoundException();
    }

    if (!applicantEntity.user.state) {
      throw new UserIsDisabledException();
    }

    if (!applicantEntity.position.state) {
      throw new PositionIsDisabledException();
    }

    if (!applicantEntity.position.available) {
      throw new PositionIsNotAvailableException();
    }

    await this.applicantRepository.save({
      state: true,
      id: applicantEntity.id,
    });
  }

  async deleteApplicant(id: Uuid): Promise<void> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.id = :id', { id });

    const applicantEntity = await queryBuilder.getOne();

    if (!applicantEntity) {
      throw new ApplicantNotFoundException();
    }

    await this.applicantRepository.save({
      id: applicantEntity.id,
      state: false,
    });
  }
}
