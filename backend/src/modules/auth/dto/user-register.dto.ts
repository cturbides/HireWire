import { DocumentIdField, EmailField, PasswordField, StringField } from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  readonly email!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @DocumentIdField()
  readonly documentId!: string;
}
