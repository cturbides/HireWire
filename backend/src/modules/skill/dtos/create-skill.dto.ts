import { StringField } from '../../../decorators';

export class CreateSkillDto {
  @StringField()
  description!: string;
}
