import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { retry } from 'rxjs';

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
    let author = undefined;
    try {
      author = await this.usersService.findOneById(createPostDto.authorId);
    } catch (error) {
      throw new RequestTimeoutException(
        'Error could not connnect to the database',
      );
    }

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

  public async update(patchPostDto: PatchPostDto) {
    // find the tags
    let tags = undefined;
    let post = undefined;
    try {
      tags = await this.tagsService.findMutipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process request at the moment try again later',
      );
    }

    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException(
        'Please Check your Tag Ids and ensure they are correct',
      );
    }
    // find the exixsing post based on id

    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process request at the moment try again later',
      );
    }
    if (!post) {
      throw new BadRequestException('Please try again later');
    }
    // update the properties that need to be updated
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    // assigning the tags
    post.tags = tags;
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable  to process your request at the moment',
      );
    }

    // save the post and return it
    return post;
  }
  /**Method to delete a post */
  public async delete(id: number) {
    // deleting the post
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
