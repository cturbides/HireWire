import { StringField } from '../../../decorators';

export class CreateLanguageDto {
  @StringField()
  description!: string;
}
