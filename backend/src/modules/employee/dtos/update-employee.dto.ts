import { DocumentIdFieldOptional, NumberFieldOptional, StringFieldOptional, UUIDFieldOptional } from '../../../decorators';

export class UpdateEmployeeDto {
  @UUIDFieldOptional()
  userId!: string;

  @UUIDFieldOptional()
  positionId!: string;

  @NumberFieldOptional({ int: false, isPositive: true })
  mensualSalary!: number;

  @StringFieldOptional()
  department!: string;

  @StringFieldOptional()
  @DocumentIdFieldOptional()
  documentId!: string;
}
