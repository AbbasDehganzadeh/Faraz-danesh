import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from "class-validator"
import { Type } from "class-transformer"

export class CommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    @IsOptional()
    text: string;

    @Type(() => Number)
    @Min(1)
    @Max(5)
    @IsInt()
    rate: number;
}
