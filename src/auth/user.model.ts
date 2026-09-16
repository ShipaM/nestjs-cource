import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ timestamps: true, collection: 'Auth' })
export class UserModel {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;
}

export const AuthSchema = SchemaFactory.createForClass(UserModel);
