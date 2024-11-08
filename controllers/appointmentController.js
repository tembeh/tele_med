const Appointment = require('../Models/Appointment');

// Controller to get user-specific appointments
exports.getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id }).sort({ date: 1 });
        res.render('myAppointments', { appointments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.bookAppointment = (req, res) => {
    // Your appointment booking logic here
    res.send('Appointment booked successfully!');
};