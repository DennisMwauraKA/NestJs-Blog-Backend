import { Injectable } from '@nestjs/common';
import { CreateMetaOptionsDto } from '../dtos/create-post-meta-options.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-options.entity';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async create(createMetaOptionsDto: CreateMetaOptionsDto) {
    let metaOption = this.metaOptionRepository.create(createMetaOptionsDto);

    return await this.metaOptionRepository.save(metaOption);
  }
}
