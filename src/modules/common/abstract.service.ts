import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginatedResult } from 'src/interfaces/paginated-results.interface';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import path, { join } from 'path';

@Injectable()
export abstract class AbstractService {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations = []): Promise<any[]> {
    try {
      return this.repository.find({ relations });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a list of elements.',
      );
    }
  }

  async findBy(condition, relations = []): Promise<any> {
    try {
      return this.repository.findOne({
        where: condition,
        relations,
      });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${condition}.`,
      );
    }
  }

  async findById(id: string, relations = []): Promise<any> {
    try {
      const element = await this.repository.findOne({
        where: { id },
        relations,
      });
      if (!element) {
        throw new BadRequestException(`Cannot find element with id: ${id}`);
      }
      return element;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with an id: ${id}.`,
      );
    }
  }

  async remove(id: string): Promise<any> {
    const element = await this.findById(id);
    console.log('element', element);
    try {
      const imagePath = join(process.cwd(), 'files', element.image);
      fs.unlinkSync(imagePath);
      return this.repository.remove(element);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while deleting an element.',
      );
    }
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 1000;

    try {
      const [data, total] = await this.repository.findAndCount({
        relations: ['user'],
        skip: (page - 1) * 10,
        take: take,
      });

      return {
        data: data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      };
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a paginated elements.',
      );
    }
  }
}
