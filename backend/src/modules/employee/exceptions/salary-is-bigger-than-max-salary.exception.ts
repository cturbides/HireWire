import { BadRequestException } from '@nestjs/common';

export class SalaryIsBiggerThanMaxSalaryException extends BadRequestException {
  constructor(error?: string) {
    super('error.salaryIsBiggerThanMaxSalary', error);
  }
}
