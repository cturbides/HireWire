import { DocumentIdFieldOptional, NumberFieldOptional, StringFieldOptional, UUIDFieldOptional } from '../../../decorators';

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
}
