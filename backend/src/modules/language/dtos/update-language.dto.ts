import { StringFieldOptional } from '../../../decorators';

export class UpdateLanguageDto {
  @StringFieldOptional()
  description!: string;
}
