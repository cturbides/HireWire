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
import { Auth, UUIDParam } from '../../decorators';
import { CreateSkillDto } from './dtos/create-skill.dto';
import type { SkillDto } from './dtos/skill.dto';
import { SkillPageOptionsDto } from './dtos/skill-page-options.dto';
import { UpdateSkillDto } from './dtos/update-skill.dto';
import { SkillService } from './skill.service';
import { RoleType } from '../../constants/role-type';

@Controller('skills')
@ApiTags('skills')
export class SkillController {
  private logger: Logger = new Logger('SkillController');

  constructor(private skillService: SkillService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createSkill(@Body() createSkillDto: CreateSkillDto) {
    const entity = await this.skillService.createSkill(createSkillDto);

    return entity.toDto();
  }

  @Get('enabled')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  getAllEnabledSkill(@Query() skillPageOptionsDto: SkillPageOptionsDto): Promise<PageDto<SkillDto>> {
    return this.skillService.getAllEnabledSkill(skillPageOptionsDto);
  }

  @Get()
  @Auth([RoleType.ADMIN], { public: true })
  @HttpCode(HttpStatus.OK)
  getAllSkill(@Query() skillPageOptionsDto: SkillPageOptionsDto): Promise<PageDto<SkillDto>> {
    return this.skillService.getAllSkill(skillPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleSkill(@UUIDParam('id') id: Uuid): Promise<SkillDto> {
    const entity = await this.skillService.getSingleSkill(id);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  updateSkill(
    @UUIDParam('id') id: Uuid,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<void> {
    return this.skillService.updateSkill(id, updateSkillDto);
  }

  @Post('activate/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  activateSkill(
    @UUIDParam('id') id: Uuid,
  ): Promise<void> {
    return this.skillService.activateSkill(id);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteSkill(@UUIDParam('id') id: Uuid): Promise<void> {
    this.logger.log(`Starting to delete Skill with id '${id}'.`);
    await this.skillService.deleteSkill(id);
  }
}
