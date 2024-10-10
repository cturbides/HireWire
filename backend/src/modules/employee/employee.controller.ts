import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Logger
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { Auth, UUIDParam } from '../../decorators';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import type { EmployeeDto } from './dtos/employee.dto';
import { EmployeePageOptionsDto } from './dtos/employee-page-options.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { EmployeeService } from './employee.service';
import { RoleType } from '../../constants/role-type';
import { EmployeeReportDto } from './dtos/employee-report.dto';

@Controller('employees')
@ApiTags('employees')
export class EmployeeController {
  private logger: Logger = new Logger('EmployeeController');

  constructor(private employeeService: EmployeeService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    const entity = await this.employeeService.createEmployee(createEmployeeDto);

    return entity.toDto();
  }

  @Get('available')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  getAllEnabledEmployee(@Query() employeePageOptionsDto: EmployeePageOptionsDto): Promise<PageDto<EmployeeDto>> {
    return this.employeeService.getAllEnabledEmployee(employeePageOptionsDto);
  }

  @Get()
  @Auth([RoleType.ADMIN], { public: true })
  @HttpCode(HttpStatus.OK)
  getAllEmployee(@Query() employeePageOptionsDto: EmployeePageOptionsDto): Promise<PageDto<EmployeeDto>> {
    return this.employeeService.getAllEmployee(employeePageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleEmployee(@UUIDParam('id') id: Uuid): Promise<EmployeeDto> {
    const entity = await this.employeeService.getSingleEmployee(id);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  updateEmployee(
    @UUIDParam('id') id: Uuid,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<void> {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Post('activate/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  activateEmployee(
    @UUIDParam('id') id: Uuid,
  ): Promise<void> {
    return this.employeeService.activateEmployee(id);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteEmployee(@UUIDParam('id') id: Uuid): Promise<void> {
    this.logger.log(`Starting to delete Employee with id '${id}'.`);
    await this.employeeService.deleteEmployee(id);
  }

  @Get('report')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  async getEmployeeReport(@Query() employeeReportDto: EmployeeReportDto): Promise<EmployeeDto[]> {
    const employees = await this.employeeService.getEmployeesByJoinDateRange(employeeReportDto);

    // Convertimos las entidades a DTOs
    return employees.map(employee => employee.toDto());
  }
}
