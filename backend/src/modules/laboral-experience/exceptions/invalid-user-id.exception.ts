import { BadRequestException } from '@nestjs/common';

export class InvalidUserIdException extends BadRequestException {
  constructor(error?: string) {
    super('error.invalidUserId', error);
  }
}
