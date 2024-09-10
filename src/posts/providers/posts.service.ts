import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class PostsService {
  /**injecting a user service */

  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,
  ) {}

  /**creating post methods */

  public async create(@Body() createPostDto: CreatePostDto) {
    //find author from the database by authorid
    let author = await this.usersService.findOneById(createPostDto.authorId);

    // find tags

    let tags = await this.tagsService.findMutipleTags(createPostDto.tags);
    // create post

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }
  public async findAll(userId: string) {
    let posts = this.postsRepository.find({
      relations: {
        metaOptions: true,
        //tags:true
      },
    });
    return posts;
  }

  /**Method to delete a post */
  public async delete(id: number) {
    // deleting the post
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
