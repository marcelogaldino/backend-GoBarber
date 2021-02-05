import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UserMap from '../../../../../mappers/UserMap';

export default class UsersController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUserService);

        const hashedPassword = await hash(password, 8);

        const userExecute = await createUser.execute({
            name,
            email,
            password: hashedPassword,
        });

        const mappedUser = new UserMap();

        const user = mappedUser.toDTO(userExecute);

        return response.json(user);
    }
}
