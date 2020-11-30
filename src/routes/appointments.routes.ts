import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '../service/CreateAppointmentService';

import AppointmentsRepository from '../repositories/AppointmentRepository';

const appointmentsRoutes = Router();

const appointmentsRepository = new AppointmentsRepository();

appointmentsRoutes.get('/', (request, response) => {
    const allAppointments = appointmentsRepository.All();

    return response.json(allAppointments);
});

appointmentsRoutes.post('/', (request, response) => {
    try {
        const { provider, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService(
            appointmentsRepository,
        );

        const appointment = createAppointment.execute({
            date: parsedDate,
            provider,
        });

        return response.json(appointment);
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

export default appointmentsRoutes;
