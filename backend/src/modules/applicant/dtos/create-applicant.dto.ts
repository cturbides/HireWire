import { DocumentIdField, NumberField, StringField, UUIDField } from '../../../decorators';

export class CreateApplicantDto {
  @UUIDField()
  userId!: string;

  @UUIDField()
  positionId!: string;

  @NumberField({ int: false, isPositive: true })
  desiredSalary!: number;

  @StringField()
  @DocumentIdField()
  documentId!: string;

  @StringField()
  recommendedBy!: string;
}
