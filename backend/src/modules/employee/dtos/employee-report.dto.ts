import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeReportDto {
  @ApiPropertyOptional({ description: 'Start date of employee join date filter' })
  @IsOptional()
  @IsDateString()
  readonly startDate?: string;

  @ApiPropertyOptional({ description: 'End date of employee join date filter' })
  @IsOptional()
  @IsDateString()
  readonly endDate?: string;
}
