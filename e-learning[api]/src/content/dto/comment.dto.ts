import {
    IsInt,
    IsNotEmptyObject,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from "class-validator"
import { Type } from "class-transformer"

export class CommentDto {
    @IsString()
    @IsNotEmptyObject()
    @MaxLength(250)
    @IsOptional()
    text: string;

    @Type(() => Number)
    @Min(0)
    @Max(5)
    @IsInt()
    rate: number;
}
