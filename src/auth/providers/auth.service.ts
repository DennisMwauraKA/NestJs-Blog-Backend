import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  // injecting usersService

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public login(email: string, id: string, password: string) {
    const user = this.usersService.findOneById('120');
    return 'Sample';
  }
  public isAuth() {
    return true;
  }
}
