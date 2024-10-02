import { Entity, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { ApplicantDto } from './dtos/applicant.dto';
import { UserEntity } from '../user/user.entity';
import { PositionEntity } from '../position/position.entity';

@Entity({ name: 'Applicants' })
@UseDto(ApplicantDto)
export class ApplicantEntity extends AbstractEntity<ApplicantDto> {
  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  user!: UserEntity;

  @Column({ nullable: false, type: 'varchar', unique: true })
  documentId!: string;

  @Column({ nullable: false, type: 'float' })
  desiredSalary!: number;

  @Column({ nullable: false, type: 'varchar' })
  recommendedBy!: string;

  @ManyToOne(() => PositionEntity, { nullable: false })
  @JoinColumn()
  position!: PositionEntity;
}
