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
import { CreatePositionDto } from './dtos/create-position.dto';
import type { PositionDto } from './dtos/position.dto';
import { PositionPageOptionsDto } from './dtos/position-page-options.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { PositionService } from './position.service';
import { RoleType } from '../../constants/role-type';

@Controller('positions')
@ApiTags('positions')
export class PositionController {
  private logger: Logger = new Logger('PositionController');

  constructor(private positionService: PositionService) {}

  @Post()
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  async createPosition(@Body() createPositionDto: CreatePositionDto) {
    const entity = await this.positionService.createPosition(createPositionDto);

    return entity.toDto();
  }

  @Get('available')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  getAllEnabledPosition(@Query() positionPageOptionsDto: PositionPageOptionsDto): Promise<PageDto<PositionDto>> {
    return this.positionService.getAllAvailablePosition(positionPageOptionsDto);
  }

  @Get()
  @Auth([RoleType.ADMIN], { public: true })
  @HttpCode(HttpStatus.OK)
  getAllPosition(@Query() positionPageOptionsDto: PositionPageOptionsDto): Promise<PageDto<PositionDto>> {
    return this.positionService.getAllPosition(positionPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSinglePosition(@UUIDParam('id') id: Uuid): Promise<PositionDto> {
    const entity = await this.positionService.getSinglePosition(id);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  updatePosition(
    @UUIDParam('id') id: Uuid,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<void> {
    return this.positionService.updatePosition(id, updatePositionDto);
  }

  @Post('activate/:id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  activatePosition(
    @UUIDParam('id') id: Uuid,
  ): Promise<void> {
    return this.positionService.activatePosition(id);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  async deletePosition(@UUIDParam('id') id: Uuid): Promise<void> {
    this.logger.log(`Starting to delete Position with id '${id}'.`);
    await this.positionService.deletePosition(id);
  }
}
