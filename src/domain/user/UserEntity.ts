import { generate as randPwd } from 'generate-password';
import { config } from '../../infra/config';

export type JWTToken = string;

export type JWTTokenDecoded = {
    id?: number;
    email?: string;
    type?: string;
}

export enum UserRole {
    ADMIN = 1,
    SALES = 2,
    COMMERCIAL =3
}

export class UserAccessTokens {
    accessToken?: JWTToken;
    expiresIn?: number;
}

export class UserEntity {
    id?: number;
    role: UserRole;
    email: string;
    fullname: string;
    password: string;
    tokens?: UserAccessTokens;
    updatedAt?: Date;
    createdAt?: Date;
    last_sign_in?: Date;

    static generateRandomPassword(): string {
        return randPwd({
            length: config.auth.minPwdLength,
            numbers: true,
            excludeSimilarCharacters: true,
            strict: true
        });
    }

}
