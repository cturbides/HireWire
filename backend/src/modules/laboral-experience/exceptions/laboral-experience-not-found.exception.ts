import { NotFoundException } from '@nestjs/common';

export class LaboralExperienceNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.laboralExperienceNotFound', error);
  }
}
