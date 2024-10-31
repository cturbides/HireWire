import { IsOptional, IsUUID } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class ApplicantPageOptionsDto extends PageOptionsDto {
    @IsOptional()
    @IsUUID()
    positionId?: string;
  
    @IsOptional()
    @IsUUID()
    skillId?: string;
  
    @IsOptional()
    @IsUUID()
    educationId?: string;
}
