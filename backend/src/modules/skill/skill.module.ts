import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSkillHandler } from './commands/create-skill.command';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { GetSkillHandler } from './queries/get-skill.query';
import { SkillEntity } from './skill.entity';

const handlers = [CreateSkillHandler, GetSkillHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity])],
  providers: [SkillService, ...handlers],
  controllers: [SkillController],
})
export class SkillModule {}
