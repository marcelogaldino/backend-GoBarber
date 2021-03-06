import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import UserMap from '../../../../../mappers/UserMap';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const showProfile = container.resolve(ShowProfileService);

        const userExecute = await showProfile.execute({ user_id });

        const mappedUser = new UserMap();

        const user = mappedUser.toDTO(userExecute);

        return response.json(classToClass(user));
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, password, old_password } = request.body;

        const updateProfile = container.resolve(UpdateProfileService);

        const userExecute = await updateProfile.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });

        const mappedUser = new UserMap();

        const user = mappedUser.toDTO(userExecute);

        return response.json(classToClass(user));
    }
}
