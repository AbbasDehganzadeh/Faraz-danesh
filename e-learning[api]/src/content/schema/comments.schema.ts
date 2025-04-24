import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false , timestamps: true})
export class Comment {
  @Prop({length: 250})
  text: string;

  @Prop({isInteger: true})
  rate: number;
}
