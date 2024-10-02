import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dtos';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    // injecting dependencies
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    //find author from the database by authorid
    let author = undefined;
    let tags = undefined;
    try {
      // find author from database based on Id
      author = await this.usersService.findOneById(user.sub);
      // find tags
      tags = await this.tagsService.findMutipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    // create post

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'ensure slug is unique',
      });
    }
  }
}
