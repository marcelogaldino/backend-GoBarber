import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        const updateUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com.br',
        });

        expect(updateUser.name).toBe('John Tre');
        expect(updateUser.email).toBe('johntre@example.com.br');
    });

    it('should not be able to update to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@example.com.br',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'johndoe@example.com.br',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        const updateUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com.br',
            oldPassword: '123456',
            password: '123123',
        });

        expect(updateUser.password).toBe('123123');
    });

    it('should not be able to update the password without an old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Tre',
                email: 'johntre@example.com.br',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Tre',
                email: 'johntre@example.com.br',
                oldPassword: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the profile from a non-existing user', async () => {
        expect(
            updateProfileService.execute({
                user_id: 'non-existing user',
                name: 'test',
                email: 'test@example.com.br',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
