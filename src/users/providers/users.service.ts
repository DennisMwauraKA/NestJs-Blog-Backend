import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { error } from 'console';
@Injectable()
/** class to connect users table and perform business operation*/
export class UsersService {
  /** Injecting users repository*/

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  /**Method to create a user and save to the database */
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request please try again',
        {
          description: 'Error connecting to the Database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists,please check your email',
      );
    }

    // create user if there is no existing user in database
    let newUser = this.userRepository.create(createUserDto);

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'this action could not be completed please try again later',
        {
          description: 'Error connecting to the DataBase',
        },
      );
    }
    return newUser;
  }

  /**The method to get all the users from the database */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'API endpoint does not exist',
        fileName: 'user.service',
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
      },
    );
  }

  /**Find a user using the Id of the User */

  public async findOneById(id: number) {
    let user = undefined;

    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the DataBase');
    }

    if (!user) {
      throw new BadRequestException('User does Not exist');
    }

    return user;
  }
}
