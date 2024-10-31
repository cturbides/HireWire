import { NotFoundException } from '@nestjs/common';

export class FoundEmployeeException extends NotFoundException {
  constructor(error?: string) {
    super('error.foundEmployeeError', error);
  }
}
