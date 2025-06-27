import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceCategoryController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';
import { ServiceCategory, ServiceCategorySchema } from './service-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCategory.name, schema: ServiceCategorySchema }
    ])
  ],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService]
})
export class ServiceCategoryModule {}
