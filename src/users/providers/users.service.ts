import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
@Injectable()
export class UsersService {
  /*find all users*/
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
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

  /*find a user by id */

  public findOneById(id: string) {
    return {
      id: 232,
      firstName: 'Alez',
      email: 'alez@gmail.com',
    };
  }
}
