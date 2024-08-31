import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  /**injecting a user service */

  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'test1',
        content: 'content test1',
      },
      {
        user: user,
        title: 'test12',
        content: 'content test2',
      },
    ];
  }
}
