import { BadRequestException } from '@nestjs/common';

export class InvalidDateException extends BadRequestException {
  constructor(error?: string) {
    super('error.invalidDate', error);
  }
}
