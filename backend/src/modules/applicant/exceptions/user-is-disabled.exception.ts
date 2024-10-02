import { BadRequestException } from '@nestjs/common';

export class UserIsDisabledException extends BadRequestException {
  constructor(error?: string) {
    super('error.userIsDisabled', error);
  }
}
