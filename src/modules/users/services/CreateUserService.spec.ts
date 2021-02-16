import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new User', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createAppointment = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const appointment = await createAppointment.execute({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        expect(appointment).toHaveProperty('id');
    });

    it('should not be able to create a User with the same email address', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createAppointment = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createAppointment.execute({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        expect(
            createAppointment.execute({
                name: 'John Doe',
                email: 'johndoe@example.com.br',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
