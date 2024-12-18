import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreatePositionHandler } from './commands/create-position.command';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { GetPositionHandler } from './queries/get-position.query';
import { PositionEntity } from './position.entity';
import { EmployeeEntity } from '../employee/employee.entity';

const handlers = [CreatePositionHandler, GetPositionHandler];

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity, EmployeeEntity])],
  providers: [PositionService, ...handlers],
  controllers: [PositionController],
  exports: [PositionService]
})
export class PositionModule {}
