import { DocumentIdField, NumberField, StringField, UUIDField } from '../../../decorators';

export class CreateEmployeeDto {
  @UUIDField()
  userId!: string;

  @UUIDField()
  positionId!: string;

  @NumberField({ int: false, isPositive: true })
  mensualSalary!: number;

  @StringField()
  department!: string;

  @StringField()
  @DocumentIdField()
  documentId!: string;
}
