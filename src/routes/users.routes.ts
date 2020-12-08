import { Router } from 'express';
import { hash } from 'bcryptjs';

import multer from 'multer';

import uploadConfig from '../config/upload';
import UserMap from '../mappers/UserMap';
import CreateUserService from '../service/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../service/UpdateUserAvatarService';

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.get('/', async (request, response) => {
    return response.send('ok');
});

usersRoutes.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const hashedPassword = await hash(password, 8);

    const userExecute = await createUser.execute({
        name,
        email,
        password: hashedPassword,
    });

    const mappedUser = new UserMap();

    const user = mappedUser.toDTO(userExecute);

    return response.json(user);
});

usersRoutes.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateUserAvatar = new UpdateUserAvatarService();

        const unmappedUser = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        const mappedUser = new UserMap();

        const user = mappedUser.toDTO(unmappedUser);

        return response.json(user);
    },
);

export default usersRoutes;
