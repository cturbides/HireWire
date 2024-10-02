import { NotFoundException } from '@nestjs/common';

export class PositionNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.positionNotFound', error);
  }
}
