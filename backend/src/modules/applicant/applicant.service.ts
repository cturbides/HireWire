import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { Order } from '../../constants';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateApplicantCommand } from './commands/create-applicant.command';
import type { ApplicantDto } from './dtos/applicant.dto';
import type { ApplicantPageOptionsDto } from './dtos/applicant-page-options.dto';
import { ApplicantNotFoundException } from './exceptions/applicant-not-found.exception';
import { ApplicantEntity } from './applicant.entity';
import { CreateApplicantDto } from './dtos/create-applicant.dto';
import type { UpdateApplicantDto } from './dtos/update-applicant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
import { SkillEntity } from '../skill/skill.entity';
import { LaboralExperienceEntity } from '../laboral-experience/laboral-experience.entity';
import { EducationEntity } from '../education/education.entity';

@Injectable()
export class ApplicantService {
  private logger: Logger = new Logger('ApplicantController');

  constructor(
    private commandBus: CommandBus,
    private userService: UserService,
    private positionService: PositionService,
    @InjectRepository(ApplicantEntity)
    private applicantRepository: Repository<ApplicantEntity>,
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
    @InjectRepository(LaboralExperienceEntity)
    private laboralExperienceRepository: Repository<LaboralExperienceEntity>,
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  @Transactional()
  async createApplicant(
    user: UserDto,
    createApplicantDto: CreateApplicantDto,
  ): Promise<ApplicantEntity> {
    this.logger.log(`applicant --> ${JSON.stringify(createApplicantDto)}`);

    const foundUser = await this.userService.getUser(
      createApplicantDto.userId as Uuid,
    );
    const position = await this.positionService.getSinglePosition(
      createApplicantDto.positionId as Uuid,
    );

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

    const skills = await this.skillRepository.findBy({
      id: In(createApplicantDto.skillIds),
    });
    const laboralExperiences = await this.laboralExperienceRepository.findBy({
      id: In(createApplicantDto.laboralExperienceIds),
      user: { id: In([createApplicantDto.userId]) },
    });
    const educations = await this.educationRepository.findBy({
      id: In(createApplicantDto.educationIds),
      user: { id: In([createApplicantDto.userId]) },
    });

    this.logger.log(`skills --> ${JSON.stringify(skills)}`);
    this.logger.log(
      `laboralExperiences --> ${JSON.stringify(laboralExperiences)}`,
    );
    this.logger.log(`educations --> ${JSON.stringify(educations)}`);

    const applicant = await this.commandBus.execute<
      CreateApplicantCommand,
      ApplicantEntity
    >(
      new CreateApplicantCommand({
        desiredSalary: createApplicantDto.desiredSalary,
        userId: createApplicantDto.userId,
        positionId: createApplicantDto.positionId,
        recommendedBy: createApplicantDto.recommendedBy,
        skillIds: skills.map((skill) => skill.id),
        laboralExperienceIds: laboralExperiences.map((exp) => exp.id),
        educationIds: educations.map((edu) => edu.id),
      }),
    );

    this.logger.log(`Applicant ---> ${JSON.stringify(applicant)}`);

    return applicant;
  }

  async getAllEnabledApplicantByUserId(
    user: UserDto,
    applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.state = :state', { state: true })
      .andWhere('applicant.user.id = :userId', { userId: user.id });

    const [items, pageMetaDto] = await queryBuilder.paginate(
      applicantPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getAllApplicantByUserId(
    user: UserDto,
    userId: string,
  ): Promise<PageDto<ApplicantDto>> {
    if (user.id !== userId && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position')
      .where('applicant.user.id = :userId', { userId: userId });

    const [items, pageMetaDto] = await queryBuilder.paginate({
      page: 1,
      take: 100000,
      skip: 0,
      order: Order.ASC,
      sort: '',
    });

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

    const [items, pageMetaDto] = await queryBuilder.paginate(
      applicantPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getAllApplicant(
    applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position');

    const [items, pageMetaDto] = await queryBuilder.paginate(
      applicantPageOptionsDto,
    );

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

  @Transactional()
  async updateApplicant(
    id: Uuid,
    user: UserDto,
    updateApplicantDto: UpdateApplicantDto,
  ): Promise<void> {
    const applicantEntity = await this.applicantRepository.findOne({
      where: { id },
      relations: ['user', 'position'],
    });

    if (!applicantEntity) {
      throw new ApplicantNotFoundException();
    }

    if (applicantEntity.user.id !== user.id && user.role !== RoleType.ADMIN) {
      throw new InvalidUserIdException();
    }

    let userId: string = applicantEntity.user.id;
    let positionId: string = applicantEntity.position.id;

    let position: PositionDto = applicantEntity.position.toDto();

    if (
      updateApplicantDto.userId &&
      updateApplicantDto.userId !== applicantEntity.user.id
    ) {
      const user = await this.userService.getUser(
        updateApplicantDto.userId as Uuid,
      );

      if (!user.state) {
        throw new UserIsDisabledException();
      }

      userId = user.id;
    }

    if (
      updateApplicantDto.positionId &&
      updateApplicantDto.positionId !== positionId
    ) {
      position = await this.positionService.getSinglePosition(
        updateApplicantDto.positionId as Uuid,
      );

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

    if (
      updateApplicantDto.desiredSalary &&
      updateApplicantDto.desiredSalary > position.maxSalary
    ) {
      throw new SalaryIsBiggerThanMaxSalaryException();
    }

    if (
      updateApplicantDto.desiredSalary &&
      updateApplicantDto.desiredSalary < position.minSalary
    ) {
      throw new SalaryIsLessThanMinSalaryException();
    }

    // Actualizar skills, experiencias laborales y capacitaciones educativas si están presentes
    const skills = updateApplicantDto.skillIds
      ? await this.skillRepository.findBy({
          id: In(updateApplicantDto.skillIds),
        })
      : applicantEntity.skills;

    const laboralExperiences = updateApplicantDto.laboralExperienceIds
      ? await this.laboralExperienceRepository.findBy({
          id: In(updateApplicantDto.laboralExperienceIds),
        })
      : applicantEntity.laboralExperiences;

    const educations = updateApplicantDto.educationIds
      ? await this.educationRepository.findBy({
          id: In(updateApplicantDto.educationIds),
        })
      : applicantEntity.educations;

    await this.applicantRepository.save({
      ...applicantEntity,
      ...updateApplicantDto,
      user: { id: userId },
      position: { id: positionId },
      skills,
      laboralExperiences,
      educations,
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

  async filterApplicants(
    applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    const { positionId, skillId, educationId } = applicantPageOptionsDto;

    this.logger.log(
      `applicantsPageOptions --> ${JSON.stringify(applicantPageOptionsDto)}`,
    );

    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.user', 'user')
      .leftJoinAndSelect('applicant.position', 'position');

    if (positionId) {
      queryBuilder.andWhere('applicant.position.id = :positionId', {
        positionId,
      });
    }

    if (skillId) {
      queryBuilder.andWhere('skills.id = :skillId', { skillId });
    }

    if (educationId) {
      queryBuilder.andWhere('educations.id = :educationId', { educationId });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(
      applicantPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }
}
