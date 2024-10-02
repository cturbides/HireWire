import { BadRequestException } from '@nestjs/common';

export class SalaryIsLessThanMinSalaryException extends BadRequestException {
  constructor(error?: string) {
    super('error.salaryIsLessThanMinSalary', error);
  }
}
