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
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123');
    });

    it('should not be able to create Appointments at the same hour', async () => {
        const appointmentDate = new Date(2020, 4, 20, 14, 0, 0);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '131232156131',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '131232156131',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});