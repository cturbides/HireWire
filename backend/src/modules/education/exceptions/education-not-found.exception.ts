import { NotFoundException } from '@nestjs/common';

export class EducationNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.educationNotFound', error);
  }
}
