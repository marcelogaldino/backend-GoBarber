import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to create a new User', async () => {
        const user = await createUser.execute({
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
        await createUser.execute({
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
