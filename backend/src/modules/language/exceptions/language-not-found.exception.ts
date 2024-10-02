import { NotFoundException } from '@nestjs/common';

export class LanguageNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.languageNotFound', error);
  }
}
