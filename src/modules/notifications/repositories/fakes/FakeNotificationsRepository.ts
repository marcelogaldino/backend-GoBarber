import { ObjectId } from 'mongodb';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class NotificationsRepository implements INotificationsRepository {
    private notifications: Notification[] = [];

    public async create({
        content,
        recipiente_id,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();

        Object.assign(notification, {
            id: new ObjectId(),
            content,
            recipiente_id,
        });

        return notification;
    }
}

export default NotificationsRepository;
