import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSkillHandler } from './commands/create-skill.command';
import { SkillController } from './skill.controller';
import { SkillRepository } from './skill.repository';
import { SkillService } from './skill.service';
import { GetSkillHandler } from './queries/get-skill.query';

const handlers = [CreateSkillHandler, GetSkillHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SkillRepository])],
  providers: [SkillService, ...handlers],
  controllers: [SkillController],
})
export class SkillModule {}
