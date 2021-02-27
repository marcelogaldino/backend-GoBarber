import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointmentService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });
    it('should be able to create a new Appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123456',
            provider_id: '123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123');
    });

    it('should not be able to create Appointments at the same hour', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointmentDate = new Date(2020, 4, 10, 12);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: '123456',
            provider_id: '131232156131',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '123456',
                provider_id: '131232156131',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an Appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: '123456',
                provider_id: '131232156131',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an Appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: '123456',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an Appointment out of the range of work (8am - 5pm)', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 7),
                user_id: '123456',
                provider_id: '123456789',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 18),
                user_id: '123456',
                provider_id: '123456789',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
