import { NumberField, StringField, UUIDField, UUIDArrayField } from '../../../decorators';

export class CreateApplicantDto {
  @UUIDField()
  userId!: string;

  @UUIDField()
  positionId!: string;

  @NumberField({ int: false, isPositive: true })
  desiredSalary!: number;

  @StringField()
  recommendedBy!: string;

  @UUIDArrayField({ each: true })
  skillIds!: string[];

  @UUIDArrayField({ each: true })
  laboralExperienceIds!: string[];

  @UUIDArrayField({ each: true })
  educationIds!: string[];
}
