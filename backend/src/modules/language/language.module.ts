import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateLanguageHandler } from './commands/create-language.command';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { GetLanguageHandler } from './queries/get-language.query';
import { LanguageEntity } from './language.entity';

const handlers = [CreateLanguageHandler, GetLanguageHandler];

@Module({
  imports: [TypeOrmModule.forFeature([LanguageEntity])],
  providers: [LanguageService, ...handlers],
  controllers: [LanguageController],
})
export class LanguageModule {}
