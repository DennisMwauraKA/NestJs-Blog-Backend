import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
/** class to connect users table and perform business operation*/
export class UsersService {
  /** Injecting users repository*/

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }
  /**The method to get all the users from the database */
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

  /**Find a user using the Id of the User */

  public findOneById(id: string) {
    return {
      id: 232,
      firstName: 'Alez',
      email: 'alez@gmail.com',
    };
  }
}
