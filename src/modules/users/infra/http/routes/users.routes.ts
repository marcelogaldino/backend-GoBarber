import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import multer from 'multer';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import uploadConfig from '@config/upload';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig.multer);

usersRouter.get('/', async (request, response) => {
    return response.send('ok');
});
usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
);
usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRouter;
