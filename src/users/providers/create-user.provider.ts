import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

import { MailService } from 'src/mail/providers/mail.service';
@Injectable()
export class CreateUserProvider {
  static createUser(createUser: any) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly mailService: MailService,
  ) {}
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
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.harshPassword(
        createUserDto.password,
      ),
    });

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

    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {

      throw new RequestTimeoutException(error)
    }
    return newUser;
  }
}
