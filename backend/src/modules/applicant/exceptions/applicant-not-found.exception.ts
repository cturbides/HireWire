import { NotFoundException } from '@nestjs/common';

export class ApplicantNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.applicantNotFound', error);
  }
}
