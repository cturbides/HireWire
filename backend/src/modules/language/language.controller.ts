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
import { CreateLanguageDto } from './dtos/create-language.dto';
import type { LanguageDto } from './dtos/language.dto';
import { LanguagePageOptionsDto } from './dtos/language-page-options.dto';
import { UpdateLanguageDto } from './dtos/update-language.dto';
import { LanguageService } from './language.service';
import { RoleType } from '../../constants/role-type';

@Controller('languages')
@ApiTags('languages')
export class LanguageController {
  private logger: Logger = new Logger('LanguageController');

  constructor(private languageService: LanguageService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createLanguage(@Body() createLanguageDto: CreateLanguageDto) {
    const entity = await this.languageService.createLanguage(createLanguageDto);

    return entity.toDto();
  }

  @Get('enabled')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  getAllEnabledLanguage(@Query() languagePageOptionsDto: LanguagePageOptionsDto): Promise<PageDto<LanguageDto>> {
    return this.languageService.getAllEnabledLanguage(languagePageOptionsDto);
  }

  @Get()
  @Auth([RoleType.ADMIN], { public: true })
  @HttpCode(HttpStatus.OK)
  getAllLanguage(@Query() languagePageOptionsDto: LanguagePageOptionsDto): Promise<PageDto<LanguageDto>> {
    return this.languageService.getAllLanguage(languagePageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleLanguage(@UUIDParam('id') id: Uuid): Promise<LanguageDto> {
    const entity = await this.languageService.getSingleLanguage(id);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  updateLanguage(
    @UUIDParam('id') id: Uuid,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ): Promise<void> {
    return this.languageService.updateLanguage(id, updateLanguageDto);
  }

  @Post('activate/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  activateLanguage(
    @UUIDParam('id') id: Uuid,
  ): Promise<void> {
    return this.languageService.activateLanguage(id);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteLanguage(@UUIDParam('id') id: Uuid): Promise<void> {
    this.logger.log(`Starting to delete Language with id '${id}'.`);
    await this.languageService.deleteLanguage(id);
  }
}
