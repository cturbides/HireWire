import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { generateHash } from '../common/utils';
import { UserEntity } from '../modules/user/user.entity';
import { EmployeeEntity } from '../modules/employee/employee.entity';
import { PositionEntity } from '../modules/position/position.entity';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    const entity = event.entity as UserEntity;

    if (entity.password !== event.databaseEntity.password) {
      entity.password = generateHash(entity.password!);
    }
  }

  async afterUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    const entity = event.entity as UserEntity;

    if (!entity.state) {
      const employeeRepository = event.connection.getRepository(EmployeeEntity);
      const positionRepository = event.connection.getRepository(PositionEntity);

      const employee = await employeeRepository.findOne({ where: { user: { id: entity.id } } });

      if (employee && employee.id) {
        await employeeRepository.save({
          id: employee.id,
          state: false,
        });

        await positionRepository.save({
          available: true,
          id: employee.position.id,
        })
      }
    }
  }
}
