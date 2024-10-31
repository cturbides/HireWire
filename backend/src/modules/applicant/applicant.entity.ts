import { Entity, Column, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { ApplicantDto } from './dtos/applicant.dto';
import { UserEntity } from '../user/user.entity';
import { PositionEntity } from '../position/position.entity';
import { SkillEntity } from '../skill/skill.entity';
import { LaboralExperienceEntity } from '../laboral-experience/laboral-experience.entity';
import { EducationEntity } from '../education/education.entity';

@Entity({ name: 'Applicants' })
@UseDto(ApplicantDto)
export class ApplicantEntity extends AbstractEntity<ApplicantDto> {

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  user!: UserEntity;

  @Column({ nullable: false, type: 'float' })
  desiredSalary!: number;

  @Column({ nullable: false, type: 'varchar' })
  recommendedBy!: string;

  @ManyToOne(() => PositionEntity, { nullable: false })
  @JoinColumn()
  position!: PositionEntity;

  @ManyToMany(() => SkillEntity, { eager: true })
  @JoinTable() 
  skills!: SkillEntity[];

  @ManyToMany(() => LaboralExperienceEntity, { cascade: true, eager: true })
  @JoinTable() 
  laboralExperiences!: LaboralExperienceEntity[];

  @ManyToMany(() => EducationEntity, { cascade: true, eager: true })
  @JoinTable() 
  educations!: EducationEntity[];
}
