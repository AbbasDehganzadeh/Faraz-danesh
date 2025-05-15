import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class InsertCartDto {
  // @Expose({ name: 'pid' })
  @IsNotEmpty()
  // @IsUUID()
  pid: string;
}
