import User from '@modules/users/infra/typeorm/entities/User';

export default class UserMap {
    public toDTO({
        id,
        name,
        avatar,
        email,
        created_at,
        updated_at,
    }: User): Omit<User, 'password'> {
        return {
            id,
            name,
            avatar,
            email,
            created_at,
            updated_at,
        };
    }
}
