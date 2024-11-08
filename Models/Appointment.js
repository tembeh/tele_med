const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);