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
  Logger
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { CreateLaboralExperienceDto } from './dtos/create-laboral-experience.dto';
import type { LaboralExperienceDto } from './dtos/laboral-experience.dto';
import { LaboralExperiencePageOptionsDto } from './dtos/laboral-experience-page-options.dto';
import { UpdateLaboralExperienceDto } from './dtos/update-laboral-experience.dto';
import { LaboralExperienceService } from './laboral-experience.service';
import { RoleType } from '../../constants/role-type';
import { UserDto } from '..//user/dtos/user.dto';

@Controller('laboralExperiences')
@ApiTags('laboralExperiences')
export class LaboralExperienceController {
  private logger: Logger = new Logger('LaboralExperienceController');

  constructor(private laboralExperienceService: LaboralExperienceService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createLaboralExperience(@AuthUser() user: UserDto, @Body() createLaboralExperienceDto: CreateLaboralExperienceDto) {
    this.logger.log(`CreateLaboralExperience --> ${JSON.stringify(createLaboralExperienceDto)}`)

    const entity = await this.laboralExperienceService.createLaboralExperience(user, createLaboralExperienceDto);

    return entity.toDto();
  }

  @Get()
  @Auth([RoleType.ADMIN], { public: true })
  @HttpCode(HttpStatus.OK)
  getAllLaboralExperience(@Query() laboralExperiencePageOptionsDto: LaboralExperiencePageOptionsDto): Promise<PageDto<LaboralExperienceDto>> {
    return this.laboralExperienceService.getAllLaboralExperience(laboralExperiencePageOptionsDto);
  }

  @Get('enabled')
  @Auth([], { public: true })
  @HttpCode(HttpStatus.OK)
  getEnabledLaboralExperience(@AuthUser() user: UserDto, @Query() laboralExperiencePageOptionsDto: LaboralExperiencePageOptionsDto): Promise<PageDto<LaboralExperienceDto>> {
    return this.laboralExperienceService.getAllEnabledLaboralExperience(user, laboralExperiencePageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleLaboralExperience(@AuthUser() user: UserDto, @UUIDParam('id') id: Uuid): Promise<LaboralExperienceDto> {
    const entity = await this.laboralExperienceService.getSingleLaboralExperience(user, id);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([])
  @HttpCode(HttpStatus.ACCEPTED)
  updateLaboralExperience(
    @AuthUser() user: UserDto,
    @UUIDParam('id') id: Uuid,
    @Body() updateLaboralExperienceDto: UpdateLaboralExperienceDto,
  ): Promise<void> {
    this.logger.log(`UpdateLaboralExperience --> ${JSON.stringify(updateLaboralExperienceDto)}`)
    return this.laboralExperienceService.updateLaboralExperience(id, user, updateLaboralExperienceDto);
  }

  @Post('activate/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  activateLaboralExperience(
    @UUIDParam('id') id: Uuid,
  ): Promise<void> {
    return this.laboralExperienceService.activateLaboralExperience(id);
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteLaboralExperience(@AuthUser() user: UserDto, @UUIDParam('id') id: Uuid): Promise<void> {
    this.logger.log(`Starting to delete LaboralExperience with id '${id}'.`);
    await this.laboralExperienceService.deleteLaboralExperience(id, user);
  }
}
