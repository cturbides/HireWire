import { Entity, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { EmployeeDto } from './dtos/employee.dto';
import { UserEntity } from '../user/user.entity';
import { PositionEntity } from '../position/position.entity';

@Entity({ name: 'Employees' })
@UseDto(EmployeeDto)
export class EmployeeEntity extends AbstractEntity<EmployeeDto> {
  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  user!: UserEntity;
  
  @Column({ nullable: false, type: 'float' })
  mensualSalary!: number;

  @Column({ nullable: true, type: 'date' })
  joinDate!: Date;

  @Column({ nullable: false,  type: 'varchar' })
  department!: string;

  @Column({ nullable: false,  type: 'varchar', unique: true })
  documentId!: string;

  @ManyToOne(() => PositionEntity, { nullable: false })
  @JoinColumn()
  position!: PositionEntity;
}
