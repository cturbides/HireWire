import { BadRequestException } from '@nestjs/common';

export class PositionIsNotAvailableException extends BadRequestException {
  constructor(error?: string) {
    super('error.positionIsNotAvailable', error);
  }
}
