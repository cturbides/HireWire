import { UUIDField } from '../../../decorators';

export class CreateEmployeeByApplicantDto {
  @UUIDField()
  positionId!: string;

  @UUIDField()
  applicantId!: string;
}
