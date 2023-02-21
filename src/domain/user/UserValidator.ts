import * as bcrypt from 'bcryptjs';
import { BadRequestError } from 'routing-controllers';
import { UserEntity } from './UserEntity';
import {UserSigninDto} from './UserDto';

export class UserValidator {
    constructor() { }

    static validate(user: UserEntity, dto?: UserSigninDto): void {
        if (!user) {
            throw new BadRequestError(dto ? 'Email or password is wrong!' : 'User not found');
        }

        if (dto && !UserValidator.comparePasswords(dto.password, user.password)) {
            throw new BadRequestError('Email or password is wrong!');
        }
    }

    private static comparePasswords(password: string, passwordHash: string): boolean {
        return bcrypt.compareSync(password, passwordHash);
    }

}