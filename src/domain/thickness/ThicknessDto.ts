import { IsNumber, Min } from 'class-validator';

export class ThicknessCreateDto {

    @IsNumber()
    @Min(0)
    value: number;

}

export class ThicknessUpdateDto {

    @IsNumber()
    @Min(0)
    value: number;
}

export class ThicknessDto {
    @IsNumber()
    id: number;

    @IsNumber()
    value: number;

}
