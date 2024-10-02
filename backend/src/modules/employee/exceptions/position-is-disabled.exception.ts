import { BadRequestException } from '@nestjs/common';

export class PositionIsDisabledException extends BadRequestException {
  constructor(error?: string) {
    super('error.positionIsDisabled', error);
  }
}
