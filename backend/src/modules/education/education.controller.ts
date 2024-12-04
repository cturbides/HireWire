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
import { CreateEducationDto } from './dtos/create-education.dto';
import type { EducationDto } from './dtos/education.dto';
import { EducationPageOptionsDto } from './dtos/education-page-options.dto';
import { UpdateEducationDto } from './dtos/update-education.dto';
import { EducationService } from './education.service';
import { RoleType } from '../../constants/role-type';
import { UserDto } from '../user/dtos/user.dto';

@Controller('education')
@ApiTags('education')
export class EducationController {
  private logger: Logger = new Logger('EducationController');

  constructor(private educationService: EducationService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createEducation(
    @AuthUser() user: UserDto,
    @Body() createEducationDto: CreateEducationDto,
  ) {
    const entity = await this.educationService.createEducation(
      user,
      createEducationDto,
    );

    return entity.toDto();
  }

  @Get()
  @Auth([RoleType.ADMIN], { public: true })
  @HttpCode(HttpStatus.OK)
  getAllEducation(
    @Query() educationPageOptionsDto: EducationPageOptionsDto,
  ): Promise<PageDto<EducationDto>> {
    return this.educationService.getAllEducation(educationPageOptionsDto);
  }

  @Get('enabled/:userId')
  @Auth([], { public: true })
  @HttpCode(HttpStatus.OK)
  getEnabledEducationByUserId(
    @AuthUser() user: UserDto,
    @UUIDParam('userId') userId: Uuid,
    @Query() educationPageOptionsDto: EducationPageOptionsDto,
  ): Promise<PageDto<EducationDto>> {
    return this.educationService.getAllEnabledEducationByUserId(
      user,
      userId,
      educationPageOptionsDto,
    );
  }

  @Get('enabled')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @HttpCode(HttpStatus.OK)
  getEnabledEducation(
    @AuthUser() user: UserDto,
    @Query() educationPageOptionsDto: EducationPageOptionsDto,
  ): Promise<PageDto<EducationDto>> {
    return this.educationService.getAllEnabledEducation(
      user,
      educationPageOptionsDto,
    );
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleEducation(
    @AuthUser() user: UserDto,
    @UUIDParam('id') id: Uuid,
  ): Promise<EducationDto> {
    const entity = await this.educationService.getSingleEducation(user, id);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([])
  @HttpCode(HttpStatus.ACCEPTED)
  updateEducation(
    @AuthUser() user: UserDto,
    @UUIDParam('id') id: Uuid,
    @Body() updateEducationDto: UpdateEducationDto,
  ): Promise<void> {
    return this.educationService.updateEducation(id, user, updateEducationDto);
  }

  @Post('activate/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  activateEducation(@UUIDParam('id') id: Uuid): Promise<void> {
    return this.educationService.activateEducation(id);
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteEducation(
    @AuthUser() user: UserDto,
    @UUIDParam('id') id: Uuid,
  ): Promise<void> {
    this.logger.log(`Starting to delete Education with id '${id}'.`);
    await this.educationService.deleteEducation(id, user);
  }
}
