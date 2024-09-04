import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
@Injectable()
/** class to connect users table and perform business operation*/
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**The method to get all the users from the database */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    return [
      {
        firstName: 'Dennis',
        email: 'ere',
      },
      {
        firstName: 'Joshua',
        email: 'Joshua@gmail.com',
      },
    ];
  }

  /**Find a user using the Id of the User */

  public findOneById(id: string) {
    return {
      id: 232,
      firstName: 'Alez',
      email: 'alez@gmail.com',
    };
  }
}
