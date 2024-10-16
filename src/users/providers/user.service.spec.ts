import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateUserProvider } from './create-user.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const mockCreateuserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 2,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
        }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CreateUserProvider, useValue: {mockCreateuserProvider} },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: FindUserByEmailProvider, useValue: {} },
        { provide: UsersCreateManyProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Userservice should be defined"', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });
    it('should call createUser on CreateuseerProvider', async () => {
      let user = await service.createUser({
        firstName: 'john',
        lastName: 'fef',
        email: 'john@gmail.com',
        password: 'uiuiw',
      });
      expect(user.firstName).toEqual('john')
      expect(CreateUserProvider.createUser).toHaveBeenCalledWith(CreateUserDto);

    });
  });
});
