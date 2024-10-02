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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { Auth, UUIDParam } from '../../decorators';
import { CreateSkillDto } from './dtos/create-skill.dto';
import type { SkillDto } from './dtos/skill.dto';
import { SkillPageOptionsDto } from './dtos/skill-page-options.dto';
import { UpdateSkillDto } from './dtos/update-skill.dto';
import { SkillService } from './skill.service';

@Controller('skills')
@ApiTags('skills')
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createSkill(@Body() createSkillDto: CreateSkillDto) {
    const entity = await this.skillService.createSkill(createSkillDto);

    return entity.toDto();
  }

  @Get()
  @Auth([])
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
  @HttpCode(HttpStatus.ACCEPTED)
  updateSkill(
    @UUIDParam('id') id: Uuid,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<void> {
    return this.skillService.updateSkill(id, updateSkillDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteSkill(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.skillService.deleteSkill(id);
  }
}
