import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';
import UserMap from '../../../../../mappers/UserMap';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);

        const unmappedUser = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        const mappedUser = new UserMap();

        const user = mappedUser.toDTO(unmappedUser);

        return response.json(classToClass(user));
    }
}
