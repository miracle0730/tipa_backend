import { injectable, inject } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { JsonController, Get, NotFoundError, Put, Param, Post, Delete, HttpCode, Body, Authorized, CurrentUser } from 'routing-controllers';
import { ResponseSchema, OpenAPI } from 'routing-controllers-openapi';
import { IUseCase } from '../../../domain/IUseCase';
import {UserDto, UpdateUserDtoIn, UserSendEmailResponseDto} from '../../../domain/user/UserDto';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { UserMap } from '../../../domain/user/UserMap';
import { IUserRepository } from '../../../domain/user/IUserRepository';
import { UserUpdateUseCase } from '../../../domain/user/UserUpdateUseCase';
import { UserChangeRoleUseCase } from '../../../domain/user/UserChangeRoleUseCase';
import { UserDeleteUseCase } from '../../../domain/user/UserDeleteUseCase';
import { UserGetAllUseCase } from '../../../domain/user/UserGetAllUseCase';
import { UserSendOnDeleteUseCase } from '../../../domain/user/UserSendOnDeleteUseCase';
import { UserSendOnRoleChangeUseCase } from '../../../domain/user/UserSendOnRoleChangeUseCase';

@injectable()
@JsonController()
export class ProfileController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(UserUpdateUseCase) private userUpdateUseCase: IUseCase<UserEntity>,
        @inject(UserChangeRoleUseCase) private userChangeRoleUseCase: IUseCase<UserEntity>,
        @inject(UserDeleteUseCase) private userDeleteUseCase: IUseCase<UserEntity>,
        @inject(UserGetAllUseCase) private userGetAllUseCase: IUseCase<UserEntity[]>,
        @inject(TYPES.UserRepository) private repo: IUserRepository,
        @inject(UserSendOnRoleChangeUseCase) private UserSendOnRoleChangeUseCase: IUseCase<UserSendEmailResponseDto>,
        @inject(UserSendOnDeleteUseCase) private UserSendOnDeleteUseCase: IUseCase<UserSendEmailResponseDto>,
    ) {
        super();
        this.logger.setPrefix('http:controller:user');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/profile')
    @OpenAPI({
        description: `Get profile`
    })
    @ResponseSchema(UserDto)
    public async getOne(@CurrentUser() user: UserEntity): Promise<UserDto> {

        const profile = await this.repo.getOne({ id: user.id });

        if (!profile) {
            throw new NotFoundError('Profile not found!');
        }

        return UserMap.toDto(user);
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Put('/api/v1/profile')
    @OpenAPI({
        description: `Update profile`
    })
    @ResponseSchema(UserDto)
    public async update(
        @CurrentUser() user: UserEntity,
        @Body() dto: UpdateUserDtoIn): Promise<UserDto> {

        this.logger.verbose(`update user ${JSON.stringify(dto, null, 2)}`);

        dto.id = user.id;
        const profile = await this.userUpdateUseCase.execute(dto);

        return UserMap.toDto(profile);
    }

    @Authorized([UserRole.ADMIN])
    @HttpCode(200)
    @Get('/api/v1/users')
    @OpenAPI({
        description: `Get all users`
    })
    @ResponseSchema(UserDto, { isArray: true })
    public async getAll(): Promise<UserDto[]> {

        const users = await this.userGetAllUseCase.execute();

        return users.map(UserMap.toDto);
    }

    @Authorized([UserRole.ADMIN])
    @HttpCode(200)
    @Delete('/api/v1/user/:userId')
    @OpenAPI({
        description: `Delete user`
    })
    @ResponseSchema(UserSendEmailResponseDto)
    public async deleteUser(
        @Param('userId') user_id: number
    ): Promise<UserSendEmailResponseDto> {

        const profile = await this.repo.getOne({ id: user_id });
        await this.userDeleteUseCase.execute(user_id);

        const message = await this.UserSendOnDeleteUseCase.execute(profile.email);

        return;
    }

    @Authorized([UserRole.ADMIN])
    @HttpCode(200)
    @Post('/api/v1/user/:userId/role/:roleId')
    @OpenAPI({
        description: `Change user role`
    })
    @ResponseSchema(UserSendEmailResponseDto)
    public async changeUserRole(
        @Param('userId') user_id: number,
        @Param('roleId') role_id: number,
    ): Promise<UserSendEmailResponseDto> {

        const profile = await this.repo.getOne({ id: user_id });
        await this.userChangeRoleUseCase.execute(user_id, role_id);


        const message = await this.UserSendOnRoleChangeUseCase.execute(profile.email, profile.role, role_id );

        return message;
    }

}