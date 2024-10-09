import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateEducationHandler } from './commands/create-education.command';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { GetEducationHandler } from './queries/get-education.query';
import { EducationEntity } from './education.entity';
import { UserModule } from '../user/user.module';
import { PositionModule } from '../position/position.module';

const handlers = [CreateEducationHandler, GetEducationHandler];

@Module({
  imports: [TypeOrmModule.forFeature([EducationEntity]), UserModule, PositionModule],
  providers: [EducationService, ...handlers],
  controllers: [EducationController],
  exports: [EducationService]
})
export class EducationModule { }
