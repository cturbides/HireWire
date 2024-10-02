import { BadRequestException } from '@nestjs/common';

export class MinSalaryIsBiggerThanMaxSalaryException extends BadRequestException {
  constructor(error?: string) {
    super('error.minSalaryIsBiggerThanMaxSalary', error);
  }
}
