import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { CreateApplicantDto } from './dtos/create-applicant.dto';
import type { ApplicantDto } from './dtos/applicant.dto';
import { ApplicantPageOptionsDto } from './dtos/applicant-page-options.dto';
import { UpdateApplicantDto } from './dtos/update-applicant.dto';
import { ApplicantService } from './applicant.service';
import { RoleType } from '../../constants/role-type';
import { UserDto } from '../../modules/user/dtos/user.dto';

@Controller('applicants')
@ApiTags('applicants')
export class ApplicantController {
  private logger: Logger = new Logger('ApplicantController');

  constructor(private applicantService: ApplicantService) {}

  @Post()
  @Auth([RoleType.USER, RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  async createApplicant(
    @Body() createApplicantDto: CreateApplicantDto,
    @AuthUser() user: UserDto,
  ) {
    const entity = await this.applicantService.createApplicant(
      user,
      createApplicantDto,
    );

    return entity.toDto();
  }

  @Get('available')
  @Auth([RoleType.USER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  getAllEnabledApplicantByUser(
    @AuthUser() user: UserDto,
    @Query() applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    return this.applicantService.getAllEnabledApplicantByUserId(
      user,
      applicantPageOptionsDto,
    );
  }

  @Get(':userId')
  @Auth([RoleType.USER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  getAllApplicantsByUserId(
    @UUIDParam('userId') userId: Uuid,
    @AuthUser() user: UserDto,
  ): Promise<PageDto<ApplicantDto>> {
    return this.applicantService.getAllApplicantByUserId(user, userId);
  }

  @Get('all')
  @Auth([RoleType.ADMIN], { public: true })
  @HttpCode(HttpStatus.OK)
  getAllApplicantByUser(
    @AuthUser() user: UserDto,
    @Query() applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    return this.applicantService.getAllApplicantByUser(
      user,
      applicantPageOptionsDto,
    );
  }

  @Get()
  @Auth([RoleType.ADMIN], { public: false })
  @HttpCode(HttpStatus.OK)
  getAllApplicant(
    @Query() applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    return this.applicantService.getAllApplicant(applicantPageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.USER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  async getSingleApplicant(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserDto,
  ): Promise<ApplicantDto> {
    const entity = await this.applicantService.getSingleApplicant(id, user);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([RoleType.USER, RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  updateApplicant(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserDto,
    @Body() updateApplicantDto: UpdateApplicantDto,
  ): Promise<void> {
    return this.applicantService.updateApplicant(id, user, updateApplicantDto);
  }

  @Post('activate/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  activateApplicant(@UUIDParam('id') id: Uuid): Promise<void> {
    return this.applicantService.activateApplicant(id);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteApplicant(@UUIDParam('id') id: Uuid): Promise<void> {
    this.logger.log(`Starting to delete Applicant with id '${id}'.`);
    await this.applicantService.deleteApplicant(id);
  }

  @Post('filter')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  async filterApplicants(
    @Query() applicantPageOptionsDto: ApplicantPageOptionsDto,
  ): Promise<PageDto<ApplicantDto>> {
    return this.applicantService.filterApplicants(applicantPageOptionsDto);
  }
}
