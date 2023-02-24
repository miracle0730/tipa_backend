import { IsString } from 'class-validator';
export class HealthDto {
    @IsString()
    status: string;
}

export class VersionDto {
    @IsString()
    build: string;

    @IsString()
    commit: string;

    @IsString()
    env: string;
}