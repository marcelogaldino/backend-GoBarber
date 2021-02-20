import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    oldPassword?: string;
    password?: string;
}

@injectable()
class UpdateProfile {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        oldPassword,
        password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User does not exist');
        }

        const userWithUpdateEmail = await this.usersRepository.findByEmail(
            email,
        );

        if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
            throw new AppError('Email already in use');
        }

        user.name = name;
        user.email = email;

        if (password && !oldPassword) {
            throw new AppError(
                'You need to inform the old password to set the new password',
            );
        }

        if (password && oldPassword) {
            const checkOldPassword = await this.hashProvider.compareHash(
                oldPassword,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError('Old Password does not match');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfile;