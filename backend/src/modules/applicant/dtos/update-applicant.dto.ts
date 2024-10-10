import { DocumentIdFieldOptional, NumberFieldOptional, StringFieldOptional, UUIDFieldOptional, UUIDArrayFieldOptional } from '../../../decorators';

export class UpdateApplicantDto {
  @UUIDFieldOptional()
  userId!: string;

  @UUIDFieldOptional()
  positionId!: string;

  @NumberFieldOptional({ int: false, isPositive: true })
  desiredSalary!: number;

  @StringFieldOptional()
  recommendedBy!: string;

  @StringFieldOptional()
  @DocumentIdFieldOptional()
  documentId!: string;

  @UUIDArrayFieldOptional({ each: true })
  skillIds?: string[];

  @UUIDArrayFieldOptional({ each: true })
  laboralExperienceIds?: string[];

  @UUIDArrayFieldOptional({ each: true })
  educationIds?: string[];
}
