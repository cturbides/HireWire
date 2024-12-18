import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { Order } from '../../constants';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateEmployeeByApplicantDto } from './dtos/create-employee-by-applicant.dto';
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
import { EmployeeEntity } from '../employee/employee.entity';
import type { UpdatePositionDto } from '../position/dtos/update-position.dto';

@Injectable()
export class ApplicantService {
  private logger: Logger = new Logger('ApplicantController');

  constructor(
    private commandBus: CommandBus,
    private userService: UserService,
    private positionService: PositionService,
    @InjectRepository(ApplicantEntity)
    private applicantRepository: Repository<ApplicantEntity>,
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
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
      this.logger.error(
        `User found with id '${user.id}' has an invalid state: ${foundUser.state}`,
      );

      throw new UserIsDisabledException();
    }

    if (foundUser.id !== user.id && user.role !== RoleType.ADMIN) {
      this.logger.error(
        `User found with id '${foundUser.id}' has a different id than request-sent user '${user.id}'`,
      );

      throw new InvalidUserIdTryingToCreateApplicantException();
    }

    if (!position.state) {
      this.logger.error(
        `Position found with id '${position.id}' has an invalid state: ${position.state}`,
      );

      throw new PositionIsDisabledException();
    }

    if (!position.available) {
      this.logger.error(
        `Position found with id '${position.id}' has is not available: ${position.available}`,
      );

      throw new PositionIsNotAvailableException();
    }

    if (createApplicantDto.desiredSalary > position.maxSalary) {
      this.logger.error(
        `Receive salary '${createApplicantDto.desiredSalary}' is bigger than maxSalary '${position.maxSalary}'.`,
      );

      throw new SalaryIsBiggerThanMaxSalaryException();
    }

    if (createApplicantDto.desiredSalary < position.minSalary) {
      this.logger.error(
        `Receive salary '${createApplicantDto.desiredSalary}' is less than minSalary '${position.minSalary}'.`,
      );

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

    this.logger.debug(`skills --> ${JSON.stringify(skills)}`);
    this.logger.debug(
      `laboralExperiences --> ${JSON.stringify(laboralExperiences)}`,
    );
    this.logger.debug(`educations --> ${JSON.stringify(educations)}`);

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

  @Transactional()
  async createEmployeeByApplicant(
    user: UserDto,
    createEmployeeByApplicantDto: CreateEmployeeByApplicantDto,
  ): Promise<void> {
    this.logger.log(
      `Creating employee from applicant by user '${user.id}': ${JSON.stringify(createEmployeeByApplicantDto)}`,
    );

    const applicant = await this.applicantRepository.findOne({
      where: { id: createEmployeeByApplicantDto.applicantId as Uuid },
      relations: ['user', 'position'],
    });

    if (!applicant) {
      this.logger.error(
        `Applicant not found with id '${createEmployeeByApplicantDto.applicantId}'`,
      );

      throw new Error('Applicant not found');
    }

    // Validar estado del applicant
    if (!applicant.user.state) {
      this.logger.error(
        `Applicant's user with id '${applicant.user.id}' is disabled`,
      );

      throw new Error('Applicant is disabled');
    }

    if (!applicant.position.state) {
      this.logger.error(
        `Position with id '${applicant.position.id}' is disabled`,
      );

      throw new Error('Position is disabled');
    }

    if (!applicant.position.available) {
      this.logger.error(
        `Position with id '${applicant.position.id}' is not available`,
      );

      throw new Error('Position is not available');
    }

    const employee = await this.employeeRepository.save({
      department: 'IT',
      user: applicant.user,
      position: applicant.position,
      mensualSalary: applicant.desiredSalary,
    });

    this.logger.log(`Created employee: ${JSON.stringify(employee)}`);

    applicant.state = false;
    await this.applicantRepository.save(applicant);

    await this.positionService.updatePosition(applicant.position.id, {
      available: false,
    } as unknown as UpdatePositionDto);

    this.logger.log(
      `Applicant with id '${applicant.id}' has been disabled after employee creation`,
    );
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
