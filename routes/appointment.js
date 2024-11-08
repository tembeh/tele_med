
const express = require('express');
const router = express.Router();
const { bookAppointment } = require('../controllers/appointmentController');
const Appointment = require('../Models/Appointment');
const { isAuthenticated } = require('../Middleware/auth'); 

// Render booking appointment page
router.get('/book-appointment', isAuthenticated, (req, res) => {
    res.render('book-appointment', { userId: req.user._id });
});

// Handle appointment booking
router.post('/book-appointment', isAuthenticated, (req, res) => {
    const { date, time, reason, patientId } = req.body;
    const newAppointment = new Appointment({
        date,
        time,
        reason,
        patient: patientId
    });

    newAppointment.save()
        .then(() => {
            res.status(201).send('Appointment booked successfully!');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error booking appointment');
        });
});
// View user appointments
router.get('/my-appointments', isAuthenticated, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id }).populate('doctor');
        res.render('my-appointments', { appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

