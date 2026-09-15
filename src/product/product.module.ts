import { Module } from '@nestjs/common';
import { ProductController } from './product.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModel, ProductSchema } from './product.model.js';

@Module({
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([
      { name: ProductModel.name, schema: ProductSchema },
    ]),
  ],
})
export class ProductModule {}
