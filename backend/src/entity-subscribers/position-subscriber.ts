import { EventSubscriber } from 'typeorm';
import { Injectable } from '@nestjs/common';
import type {
    UpdateEvent,
    EntitySubscriberInterface,
} from 'typeorm';

import { PositionEntity } from '../modules/position/position.entity';
import { EmployeeEntity } from '../modules/employee/employee.entity';

@Injectable()
@EventSubscriber()
export class PositionSuscriber implements EntitySubscriberInterface<PositionEntity> {
    listenTo(): typeof PositionEntity {
        return PositionEntity;
    }

    async afterUpdate(event: UpdateEvent<PositionEntity>): Promise<void> {
        const entity = event.entity as PositionEntity;

        if (!entity.state) {
            const employeeRepository = event.connection.getRepository(EmployeeEntity);

            const employees = await employeeRepository.find({ where: { position: { id: entity.id } } });

            for (const employee of employees) {
                await employeeRepository.save({
                    id: employee.id,
                    state: false,
                });
            }
        }
    }
}
