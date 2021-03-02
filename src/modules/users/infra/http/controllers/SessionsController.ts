import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UserMap from '../../../../../mappers/UserMap';

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const authenticateUser = container.resolve(AuthenticateUserService);

        const { user: unmappedUser, token } = await authenticateUser.execute({
            email,
            password,
        });

        const mappedUser = new UserMap();

        const user = mappedUser.toDTO(unmappedUser);

        return response.json({ user: classToClass(user), token });
    }
}
