import { injectable, inject } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { JsonController, Post, HttpCode, Body, QueryParam, Get, HttpError, Put } from 'routing-controllers';
import { ResponseSchema, OpenAPI } from 'routing-controllers-openapi';
import { IUseCase } from '../../../domain/IUseCase';
import { UserSigninDto, UserSignUpDto, UserSendEmailResponseDto, UserWithTokenDto, UserCreateDto, UserResetPasswordDto } from '../../../domain/user/UserDto';
import { UserEntity } from '../../../domain/user/UserEntity';
import { UserSigninUseCase } from '../../../domain/user/UserSigninUseCase';
import { UserMap } from '../../../domain/user/UserMap';
import { UserSendActivationEmailUseCase } from '../../../domain/user/UserSendActivationEmailUseCase';
import { Auth, JwtType } from '../../../domain/auth/Auth';
import { UserCreateUseCase } from '../../../domain/user/UserCreateUseCase';
import { UserSendResetPasswordUseCase } from '../../../domain/user/UserSendResetPasswordUseCase';
import { UserUpdateUseCase } from '../../../domain/user/UserUpdateUseCase';
import { UserUpdateLastSignInUseCase } from '../../../domain/user/UserUpdateLastSignInUseCase';

@injectable()
@JsonController()
export class AuthController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Auth) private auth: Auth,
        @inject(UserSigninUseCase) private userSigninUseCase: IUseCase<UserEntity>,
        @inject(UserSendActivationEmailUseCase) private userSendActivationEmailUseCase: IUseCase<UserSendEmailResponseDto>,
        @inject(UserSendResetPasswordUseCase) private userSendResetPasswordUseCase: IUseCase<UserSendEmailResponseDto>,
        @inject(UserCreateUseCase) private userCreateUseCase: IUseCase<UserEntity>,
        @inject(UserUpdateUseCase) private userUpdateUseCase: IUseCase<UserEntity>,
        @inject(UserUpdateLastSignInUseCase) private userUpdateLastSignInUseCase: IUseCase<void>,
    ) {
        super();
        this.logger.setPrefix('http:controller:auth');
        this.logger.info('constructor');
    }

    @HttpCode(200)
    @Post('/api/v1/user/signin')
    @OpenAPI({
        description: ``,
        security: [{}]
    })
    @ResponseSchema(UserWithTokenDto, {
        description: 'User details with access token'
    })
    public async signin(@Body() dto: UserSigninDto): Promise<UserWithTokenDto> {

        const user = await this.userSigninUseCase.execute(dto);

        await this.userUpdateLastSignInUseCase.execute(user);

        return UserMap.toWithTokensDto(user);
    }

    @HttpCode(200)
    @Post('/api/v1/user/signup')
    @OpenAPI({
        description: ``,
        security: [{}]
    })
    @ResponseSchema(UserSendEmailResponseDto)
    public async signup(@Body() dto: UserSignUpDto): Promise<UserSendEmailResponseDto> {

        const message = await this.userSendActivationEmailUseCase.execute(dto);

        return message;
    }

    @HttpCode(200)
    @Post('/api/v1/user/signup-finish')
    @OpenAPI({
        description: ``,
        security: [{}]
    })
    @ResponseSchema(UserSendEmailResponseDto)
    public async signupFinish(
        @Body() dto: UserCreateDto,
        @QueryParam('token') token: string): Promise<UserSendEmailResponseDto> {

        const decodedToken = await this.auth.verifyToken(token, JwtType.SIGN_UP);

        if (decodedToken.email !== dto.email) {
            throw new HttpError(400, 'Check your email');
        }

        await this.userCreateUseCase.execute(dto);

        return { message: 'You are registered' };
    }

    @HttpCode(200)
    @Post('/api/v1/user/reset-password')
    @OpenAPI({
        description: ``,
        security: [{}]
    })
    @ResponseSchema(UserSendEmailResponseDto)
    public async resetPassword(@Body() dto: UserSignUpDto): Promise<UserSendEmailResponseDto> {

        const message = await this.userSendResetPasswordUseCase.execute(dto);

        return message;
    }

    @HttpCode(200)
    @Put('/api/v1/user/reset-password-finish')
    @OpenAPI({
        description: ``,
        security: [{}]
    })
    @ResponseSchema(UserSendEmailResponseDto)
    public async resetPasswordFinish(
        @Body() dto: UserResetPasswordDto,
        @QueryParam('token') token: string): Promise<UserSendEmailResponseDto> {

        const decodedToken = await this.auth.verifyToken(token, JwtType.RESET_PASSWORD);

        if (decodedToken.email !== dto.email) {
            throw new HttpError(400, 'Check your email');
        }

        await this.userUpdateUseCase.execute(dto);

        return { message: 'Your password was updated' };
    }

}