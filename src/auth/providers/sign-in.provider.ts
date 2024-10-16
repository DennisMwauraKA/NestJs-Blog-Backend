import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';

import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersservice: UsersService,
    /**injecting the hashing provider */
    private readonly hashProvider: HashingProvider,

    /**injecting generate tokens provider */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    let user = await this.usersservice.findOneByEmail(signInDto.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }
    if (!isEqual) {
      throw new RequestTimeoutException('Incorrect password');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}
