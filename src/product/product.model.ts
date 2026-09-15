import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<ProductModel>;
@Schema({ _id: false })
export class ProductCharacteristics {
  @Prop()
  name: string;

  @Prop()
  value: string;
}
@Schema({ timestamps: true, collection: 'Product' })
export class ProductModel {
  _id: Types.ObjectId;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  credit: number;

  @Prop({ default: 0 })
  calculatedRating: number;

  @Prop({ default: 0 })
  ratingCount: number;

  @Prop()
  advantages: string;

  @Prop()
  disadvantages: string;

  @Prop({ type: [String] })
  categories: string[];

  @Prop()
  tags: string;

  @Prop({ type: () => [ProductCharacteristics], _id: false })
  characteristics: ProductCharacteristics[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
