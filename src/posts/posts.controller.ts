import { Body, Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger';
@Controller('posts')
@ApiTags('Posts')

export class PostsController {
  constructor(
    /*dependecy injection*/
    private readonly postService: PostsService,
  ) {}

  @Get('/:userId?')
  public getPosts(@Param('userId') userId: string) {
    return this.postService.findAll(userId);
  }
}
