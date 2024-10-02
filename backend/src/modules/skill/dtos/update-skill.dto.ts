import { StringFieldOptional, BooleanFieldOptional } from '../../../decorators';

export class UpdateSkillDto {
  @StringFieldOptional()
  description!: string;

  @BooleanFieldOptional()
  official!: boolean;
}
