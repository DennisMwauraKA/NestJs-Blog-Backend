import { Injectable } from '@nestjs/common';
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
    private userRepository: Repository<User>,
  ) {}
  /**Method to create a user and save to the database */
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    // create user if there is no existing user in database
    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
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

  public async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
