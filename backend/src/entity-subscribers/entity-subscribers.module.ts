import { Module } from '@nestjs/common';
import { UserSubscriber } from './user-subscriber';
import { PositionSuscriber } from './position-subscriber';

@Module({
    imports: [],
    providers: [PositionSuscriber, UserSubscriber],
    exports: [PositionSuscriber, UserSubscriber],
})
export class EntitySubscribersModule { }
