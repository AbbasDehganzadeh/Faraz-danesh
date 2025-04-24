import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Comment {
  @Prop()
  id: string;

  @Prop({length: 250})
  text: string;

  @Prop({isInteger: true})
  rate: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}
