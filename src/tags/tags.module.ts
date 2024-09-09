import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from './tags.entity';

@Module({
  controllers: [TagsController],
  imports: [TypeOrmModule.forFeature([Tags])],
})
export class TagsModule {}
