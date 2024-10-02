import { BadRequestException } from '@nestjs/common';

export class InvalidUserIdTryingToCreateApplicantException extends BadRequestException {
  constructor(error?: string) {
    super('error.invalidUserIdTryingToCreateApplicant', error);
  }
}
