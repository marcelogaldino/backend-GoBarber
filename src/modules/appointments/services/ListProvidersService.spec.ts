import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersService = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });
    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'John Tre',
            email: 'johntre@example.com.br',
            password: '123456',
        });

        const logedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'johnqua@example.com.br',
            password: '123456',
        });

        const providers = await listProvidersService.execute({
            user_id: logedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
