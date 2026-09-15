import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

@Schema({ _id: false })
class HhModel {
  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  juniorSalary: number;

  @Prop({ required: true })
  middleSalary: number;

  @Prop({ required: true })
  seniorSalary: number;
}
const HhSchema = SchemaFactory.createForClass(HhModel);

@Schema({ _id: false })
class AdvantageModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}
const AdvantageSchema = SchemaFactory.createForClass(AdvantageModel);

export type TopPageDocument = HydratedDocument<TopPageModel>;

@Schema({ timestamps: true, collection: 'TopPage' })
export class TopPageModel {
  _id: Types.ObjectId;

  @Prop({ required: true, enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop({ required: true })
  secondCategory: string;

  @Prop({ unique: true, required: true })
  alias: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: HhSchema })
  hh?: HhModel;

  @Prop({ type: [AdvantageSchema], default: [] })
  advantages: AdvantageModel[];

  @Prop({ required: true })
  seoText: string;

  @Prop({ required: true })
  tagsTitle: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
