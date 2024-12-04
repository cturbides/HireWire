import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { CreateApplicantDto } from '../dtos/create-applicant.dto';
import { ApplicantEntity } from '../applicant.entity';
import { SkillEntity } from '../../skill/skill.entity';
import { LaboralExperienceEntity } from '../../laboral-experience/laboral-experience.entity';
import { EducationEntity } from '../../education/education.entity';

export class CreateApplicantCommand implements ICommand {
  constructor(public readonly createApplicantDto: CreateApplicantDto) {}
}

@CommandHandler(CreateApplicantCommand)
export class CreateApplicantHandler
  implements ICommandHandler<CreateApplicantCommand, ApplicantEntity>
{
  constructor(
    @InjectRepository(ApplicantEntity)
    private applicantRepository: Repository<ApplicantEntity>,

    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,

    @InjectRepository(LaboralExperienceEntity)
    private laboralExperienceRepository: Repository<LaboralExperienceEntity>,

    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  async execute(command: CreateApplicantCommand): Promise<ApplicantEntity> {
    const { createApplicantDto } = command;

    const skills = await this.skillRepository.findBy({
      id: In(createApplicantDto.skillIds),
    });
    const laboralExperiences = await this.laboralExperienceRepository.findBy({
      id: In(createApplicantDto.laboralExperienceIds),
    });
    const educations = await this.educationRepository.findBy({
      id: In(createApplicantDto.educationIds),
    });

    const applicantEntity = this.applicantRepository.create({
      user: {
        id: createApplicantDto.userId,
      },
      position: {
        id: createApplicantDto.positionId,
      },
      recommendedBy: createApplicantDto.recommendedBy,
      desiredSalary: createApplicantDto.desiredSalary,
      skills,
      educations,
      laboralExperiences,
    });

    await this.applicantRepository.save(applicantEntity);

    return applicantEntity;
  }
}
