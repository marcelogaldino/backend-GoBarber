import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UserMap from '../../../../../mappers/UserMap';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
    const { email, password } = request.body;

    const authenticateUser = new AuthenticateUserService();

    const { user: unmappedUser, token } = await authenticateUser.execute({
        email,
        password,
    });

    const mappedUser = new UserMap();

    const user = mappedUser.toDTO(unmappedUser);

    return response.json({ user, token });
});

export default sessionsRoutes;
