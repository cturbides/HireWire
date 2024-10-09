import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateLaboralExperienceHandler } from './commands/create-laboral-experience.command';
import { LaboralExperienceController } from './laboral-experience.controller';
import { LaboralExperienceService } from './laboral-experience.service';
import { GetLaboralExperienceHandler } from './queries/get-laboral-experience.query';
import { LaboralExperienceEntity } from './laboral-experience.entity';
import { UserModule } from '../user/user.module';
import { PositionModule } from '../position/position.module';

const handlers = [CreateLaboralExperienceHandler, GetLaboralExperienceHandler];

@Module({
  imports: [TypeOrmModule.forFeature([LaboralExperienceEntity]), UserModule, PositionModule],
  providers: [LaboralExperienceService, ...handlers],
  controllers: [LaboralExperienceController],
  exports: [LaboralExperienceService]
})
export class LaboralExperienceModule { }
