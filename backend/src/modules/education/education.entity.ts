import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { EducationDto } from './dtos/education.dto';
import { UserEntity } from '../user/user.entity';
import { EducationLevel } from '../../constants/education-level.enum';

@Entity({ name: 'Educations' })
@UseDto(EducationDto)
export class EducationEntity extends AbstractEntity<EducationDto> {
  @Column({ nullable: false, type: 'varchar' })
  description!: string;

  @Column({ nullable: false, type: 'enum', enum: EducationLevel })
  level!: EducationLevel;

  @Column({ nullable: false, type: 'date' })
  startDate!: Date;

  @Column({ nullable: true, type: 'date' })
  endDate!: Date;

  @Column({ nullable: false, type: 'varchar' })
  institution!: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  user!: UserEntity;
}
