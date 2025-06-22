import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceCategory, ServiceCategoryDocument } from './service-category.schema';
import { CreateServiceCategoryDto } from './create-service-category.dto';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectModel(ServiceCategory.name)
    private readonly categoryModel: Model<ServiceCategoryDocument>
  ) {}

  async create(dto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    return this.categoryModel.create(dto);
  }

  async findAll(): Promise<ServiceCategory[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string): Promise<ServiceCategory> {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const category = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Category not found');
  }
}
