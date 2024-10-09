import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateEmployeeCommand } from './commands/create-employee.command';
import type { EmployeeDto } from './dtos/employee.dto';
import type { EmployeePageOptionsDto } from './dtos/employee-page-options.dto';
import { EmployeeNotFoundException } from './exceptions/employee-not-found.exception';
import { EmployeeEntity } from './employee.entity';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import type { UpdateEmployeeDto } from './dtos/update-employee.dto';
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
import { UpdatePositionDto } from '../position/dtos/update-position.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private commandBus: CommandBus,
    private userService: UserService,
    private positionService: PositionService,
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
  ) { }

  @Transactional()
  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    const user = await this.userService.getUser(createEmployeeDto.userId as Uuid);
    const position = await this.positionService.getSinglePosition(createEmployeeDto.positionId as Uuid);

    if (!user.state) {
      throw new UserIsDisabledException();
    }

    if (!position.state) {
      throw new PositionIsDisabledException();
    }

    if (!position.available) {
      throw new PositionIsNotAvailableException();
    }

    if (createEmployeeDto.mensualSalary > position.maxSalary) {
      throw new SalaryIsBiggerThanMaxSalaryException();
    }

    if (createEmployeeDto.mensualSalary < position.minSalary) {
      throw new SalaryIsLessThanMinSalaryException();
    }

    return this.commandBus.execute<CreateEmployeeCommand, EmployeeEntity>(
      new CreateEmployeeCommand(createEmployeeDto),
    );
  }

  async getAllEnabledEmployee(employeePageOptionsDto: EmployeePageOptionsDto): Promise<PageDto<EmployeeDto>> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.position', 'position')
      .where('employee.state = :state', { state: true });

    queryBuilder.orderBy(`employee.${employeePageOptionsDto.sort}`, employeePageOptionsDto.order);

    const [items, pageMetaDto] = await queryBuilder.paginate(employeePageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAllEmployee(
    employeePageOptionsDto: EmployeePageOptionsDto,
  ): Promise<PageDto<EmployeeDto>> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.position', 'position');

    queryBuilder.orderBy(`employee.${employeePageOptionsDto.sort}`, employeePageOptionsDto.order);

    const [items, pageMetaDto] = await queryBuilder.paginate(employeePageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleEmployee(id: Uuid): Promise<EmployeeEntity> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.position', 'position')
      .where('employee.id = :id', { id });

    const employeeEntity = await queryBuilder.getOne();

    if (!employeeEntity) {
      throw new EmployeeNotFoundException();
    }

    return employeeEntity;
  }

  async updateEmployee(
    id: Uuid,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<void> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.position', 'position')
      .where('employee.id = :id', { id });

    const employeeEntity = await queryBuilder.getOne();

    if (!employeeEntity) {
      throw new EmployeeNotFoundException();
    }

    let userId: string = employeeEntity.user.id;
    let positionId: string = employeeEntity.position.id;

    let position: PositionDto = employeeEntity.position.toDto();

    if (updateEmployeeDto.userId && updateEmployeeDto.userId !== employeeEntity.user.id) {
      const user = await this.userService.getUser(updateEmployeeDto.userId as Uuid);

      if (!user.state) {
        throw new UserIsDisabledException();
      }

      userId = user.id;
    }

    if (updateEmployeeDto.positionId && updateEmployeeDto.positionId !== positionId) {
      position = await this.positionService.getSinglePosition(updateEmployeeDto.positionId as Uuid);

      if (!position.state) {
        throw new PositionIsDisabledException();
      }

      if (!position.available) {
        throw new PositionIsNotAvailableException();
      }

      if (employeeEntity.mensualSalary > position.maxSalary) {
        throw new SalaryIsBiggerThanMaxSalaryException();
      }

      if (employeeEntity.mensualSalary < position.minSalary) {
        throw new SalaryIsLessThanMinSalaryException();
      }

      await this.positionService.updatePosition(position.id, { available: false } as UpdatePositionDto);
      await this.positionService.updatePosition(employeeEntity.position.id, { available: true } as UpdatePositionDto);

      positionId = position.id;
    }


    if (updateEmployeeDto.mensualSalary && updateEmployeeDto.mensualSalary > position.maxSalary) {
      throw new SalaryIsBiggerThanMaxSalaryException();
    }

    if (updateEmployeeDto.mensualSalary && updateEmployeeDto.mensualSalary < position.minSalary) {
      throw new SalaryIsLessThanMinSalaryException();
    }

    await this.employeeRepository.save({
      ...employeeEntity,
      ...updateEmployeeDto,
      user: {
        id: userId,
      },
      position: {
        id: positionId,
      },
      id: employeeEntity.id,
    });
  }

  async activateEmployee(id: Uuid): Promise<void> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.position', 'position')
      .where('employee.id = :id', { id });

    const employeeEntity = await queryBuilder.getOne();

    if (!employeeEntity) {
      throw new EmployeeNotFoundException();
    }

    if (!employeeEntity.user.state) {
      throw new UserIsDisabledException();
    }

    if (!employeeEntity.position.state) {
      throw new PositionIsDisabledException();
    }

    if (!employeeEntity.position.available) {
      throw new PositionIsNotAvailableException();
    }

    await this.employeeRepository.save({
      state: true,
      id: employeeEntity.id,
    });

    await this.positionService.updatePosition(employeeEntity.position.id, { available: false } as UpdatePositionDto);
  }

  async deleteEmployee(id: Uuid): Promise<void> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.position', 'position')
      .where('employee.id = :id', { id });

    const employeeEntity = await queryBuilder.getOne();

    if (!employeeEntity) {
      throw new EmployeeNotFoundException();
    }

    await this.employeeRepository.save({
      id: employeeEntity.id,
      state: false,
    });

    await this.positionService.updatePosition(employeeEntity.position.id, { available: true } as UpdatePositionDto);
  }
}
