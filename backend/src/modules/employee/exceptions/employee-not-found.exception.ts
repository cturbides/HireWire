import { NotFoundException } from '@nestjs/common';

export class EmployeeNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.employeeNotFound', error);
  }
}
