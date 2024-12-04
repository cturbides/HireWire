import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
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

  @ManyToMany(() => SkillEntity)
  @JoinTable({
    name: 'applicants_skills',
    joinColumn: {
      name: 'applicant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id',
    },
  })
  skills!: SkillEntity[];

  @ManyToMany(() => LaboralExperienceEntity)
  @JoinTable({
    name: 'applicants_laboral_experiences',
    joinColumn: {
      name: 'applicant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'laboral_experience_id',
      referencedColumnName: 'id',
    },
  })
  laboralExperiences!: LaboralExperienceEntity[];

  @ManyToMany(() => EducationEntity)
  @JoinTable({
    name: 'applicants_educations',
    joinColumn: {
      name: 'applicant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'education_id',
      referencedColumnName: 'id',
    },
  })
  educations!: EducationEntity[];
}
