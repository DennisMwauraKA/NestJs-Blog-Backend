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
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
/** class to connect users table and perform business operation*/
export class UsersService {
  /** Injecting users repository*/

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /**inject datasource */
    private readonly dataSource: DataSource,

    /**inject userCreatemanyprovider */

    private readonly usersCreateManyPorvider: UsersCreateManyProvider,

    /**inject create user provider */

    private readonly createUserProvider: CreateUserProvider,

    /**Inject findOnebyemail */

    private readonly findUserByEmail: FindUserByEmailProvider,

    /**inject find one by googleId Provider */

    private readonly findOneByGoogleIDProvider: FindOneByGoogleIdProvider,

    /**inject createGoogleUserProvider */

    private readonly createGoogleuserProvider: CreateGoogleUserProvider,
  ) {}

  /**Method to create a user and save to the database */

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

  /**Method for inserting many users using transactions */
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyPorvider.createMany(createManyUsersDto);
  }

  /**Method for creating a user */

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async findOneByEmail(email: string) {
    return this.findUserByEmail.findOneByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return this.findOneByGoogleIDProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return this.createGoogleuserProvider.createGoogleUser(googleUser);
  }
}
