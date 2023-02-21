import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ILogger } from '../ILogger';
import { TYPES } from '../../container';
import { inject, injectable } from 'inversify';
import { JWTToken, JWTTokenDecoded } from '../user/UserEntity';
import { config } from '../../infra/config';
import { HttpError, UnauthorizedError } from 'routing-controllers';

export enum JwtType {
    LOGIN = 'auth',
    SIGN_UP = 'sign-up',
    RESET_PASSWORD = 'reset-password'
}

@injectable()
export class Auth {
    ALGORITHM: jwt.Algorithm = 'HS256';
    SALT: 10;

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
    ) { }

    signToken(data: { id?: number, email?: string, type?: JwtType }): JWTToken {

        let options: jwt.SignOptions = {};
        let secret = '';

        switch (data.type) {
            case JwtType.LOGIN: {
                options = { expiresIn: config.auth.jwt.expiresIn };
                secret = config.auth.jwt.secret;
                break;
            }
            case JwtType.SIGN_UP: {
                options = { expiresIn: config.signUp.jwt.expiresIn };
                secret = config.signUp.jwt.secret;
                break;
            }
            case JwtType.RESET_PASSWORD: {
                options = { expiresIn: config.resetPassword.jwt.expiresIn };
                secret = config.resetPassword.jwt.secret;
                break;
            }
            default:
                throw new HttpError(400, 'Token type is not supported');
        }

        options.algorithm = this.ALGORITHM;
        return jwt.sign(data, secret, options);
    }

    async verifyToken(token: string, jwtType: JwtType): Promise<JWTTokenDecoded> {
        return new Promise((resolve, reject) => {
            let options: jwt.VerifyOptions = {
                algorithms: [this.ALGORITHM]
            };
            let secret: string = '';

            switch (jwtType) {
                case JwtType.LOGIN:
                    secret = config.auth.jwt.secret;
                    break;
                case JwtType.SIGN_UP:
                    secret = config.signUp.jwt.secret;
                    break;
                case JwtType.RESET_PASSWORD:
                    secret = config.resetPassword.jwt.secret;
                    break;
                default:
                    throw new HttpError(400, 'Token type is not supported');
            }

            jwt.verify(token, secret, options, function (err, decoded) {

                if (err && err.name === 'TokenExpiredError') {
                    return reject(new UnauthorizedError('Token is expired'));
                }

                if ((err && err.name === 'JsonWebTokenError') || !decoded) {
                    return reject(new UnauthorizedError('Token is invalid'));
                }

                return resolve(decoded as JWTTokenDecoded);
            });
        });
    }

    hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(this.SALT));
    }
}