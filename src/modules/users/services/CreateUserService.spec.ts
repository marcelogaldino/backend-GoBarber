import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to create a new User', async () => {
        const appointment = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        expect(appointment).toHaveProperty('id');
    });

    it('should not be able to create a User with the same email address', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        await expect(
            createUser.execute({
                name: 'John Doe',
                email: 'johndoe@example.com.br',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
