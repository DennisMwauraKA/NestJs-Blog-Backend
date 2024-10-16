import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshtokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  /** injecting usersService*/

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInProvider: SignInProvider,

    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
  public async refreshTokens(refreshTokensDto: RefreshtokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokensDto);
  }
}
