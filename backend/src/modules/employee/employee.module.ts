import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateEmployeeHandler } from './commands/create-employee.command';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { GetEmployeeHandler } from './queries/get-employee.query';
import { EmployeeEntity } from './employee.entity';
import { UserModule } from '../user/user.module';
import { PositionModule } from '../position/position.module';

const handlers = [CreateEmployeeHandler, GetEmployeeHandler];

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity]), UserModule, PositionModule],
  providers: [EmployeeService, ...handlers],
  controllers: [EmployeeController],
  exports: [EmployeeService]
})
export class EmployeeModule { }
