import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import type { CreateApplicantDto } from '../dtos/create-applicant.dto';
import { ApplicantEntity } from '../applicant.entity';

export class CreateApplicantCommand implements ICommand {
  constructor(
    public readonly createApplicantDto: CreateApplicantDto,
  ) { }
}

@CommandHandler(CreateApplicantCommand)
export class CreateApplicantHandler
  implements ICommandHandler<CreateApplicantCommand, ApplicantEntity> {
  constructor(
    @InjectRepository(ApplicantEntity)
    private applicantRepository: Repository<ApplicantEntity>,
  ) { }

  async execute(command: CreateApplicantCommand) {
    const applicantEntity = this.applicantRepository.create({
      user: {
        id: command.createApplicantDto.userId,
      },
      position: {
        id: command.createApplicantDto.positionId,
      },
      documentId: command.createApplicantDto.documentId,
      recommendedBy: command.createApplicantDto.recommendedBy,
      desiredSalary: command.createApplicantDto.desiredSalary,
    });

    await this.applicantRepository.save(applicantEntity);

    return applicantEntity;
  }
}
