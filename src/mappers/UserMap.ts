import User from '../models/User';

export default class UserMap {
    public toDTO({
        id,
        name,
        email,
        created_at,
        updated_at,
    }: User): Omit<User, 'password'> {
        return {
            id,
            name,
            email,
            created_at,
            updated_at,
        };
    }
}
