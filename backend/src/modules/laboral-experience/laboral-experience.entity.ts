import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { LaboralExperienceDto } from './dtos/laboral-experience.dto';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'LaboralExperiences' })
@UseDto(LaboralExperienceDto)
export class LaboralExperienceEntity extends AbstractEntity<LaboralExperienceDto> {
  @Column({ nullable: false, type: 'varchar' })
  company!: string; 

  @Column({ nullable: false, type: 'varchar' })
  position!: string;

  @Column({ nullable: false, type: 'date' })
  startDate!: Date;

  @Column({ nullable: true, type: 'date' })
  endDate!: Date;

  @Column({ nullable: false, type: 'float' })
  salary!: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  user!: UserEntity;
}
