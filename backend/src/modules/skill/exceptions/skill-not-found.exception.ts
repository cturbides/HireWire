import { NotFoundException } from '@nestjs/common';

export class SkillNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.skillNotFound', error);
  }
}
