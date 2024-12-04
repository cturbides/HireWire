import {
  NumberField,
  StringField,
  UUIDArrayField,
  UUIDField,
} from '../../../decorators';

export class OldCreateApplicantDto {
  @UUIDField()
  positionId!: string;

  @NumberField({ int: false, isPositive: true })
  desiredSalary!: number;

  @StringField()
  recommendedBy!: string;

  @UUIDArrayField({ each: true })
  skillIds!: string[];

  education!: string[];

  laboralExperience!: string[];
}
