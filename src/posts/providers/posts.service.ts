import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  /**injecting a user service */

  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**creating post methods */

  public async create(@Body() createPostDto: CreatePostDto) {
    // create post

    let post = this.postsRepository.create(createPostDto);

    return await this.postsRepository.save(post);
  }
  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    let posts = this.postsRepository.find({});
    return posts;
  }

  // deleting a post
  public async delete(id: number) {
    //find if  post exists with that id

    let post = await this.postsRepository.findOneBy({ id });
    // deleting the post
    //await this.postsRepository.delete(id);
    // delete metaOptions
    // await this.metaOptionsRepository.delete(post.metaOptions.id);
    let inversePost = await this.metaOptionsRepository.find({
      where: { id: post.metaOptions.id },
      relations: {
        post: true,
      },
    });

    console.log(inversePost)
    return { deleted: true, id };
  }
}
