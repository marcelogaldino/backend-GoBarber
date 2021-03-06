import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to Authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with a non existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'johndoe@example.com.br',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should note be able to authenticate a user with incorrect passowrd', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'johndoe@example.com.br',
                password: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
