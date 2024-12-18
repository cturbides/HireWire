import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
  DocumentIdFieldOptional,
} from '../../../decorators';
import type { UserEntity } from '../user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @StringFieldOptional()
  @DocumentIdFieldOptional()
  documentId!: string;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.documentId = user.documentId;
    this.isActive = options?.isActive;
  }
}
