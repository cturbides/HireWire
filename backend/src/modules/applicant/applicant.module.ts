import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateApplicantHandler } from './commands/create-applicant.command';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { GetApplicantHandler } from './queries/get-applicant.query';
import { ApplicantEntity } from './applicant.entity';
import { UserModule } from '../user/user.module';
import { PositionModule } from '../position/position.module';

const handlers = [CreateApplicantHandler, GetApplicantHandler];

@Module({
  imports: [TypeOrmModule.forFeature([ApplicantEntity]), UserModule, PositionModule],
  providers: [ApplicantService, ...handlers],
  controllers: [ApplicantController],
  exports: [ApplicantService]
})
export class ApplicantModule { }
