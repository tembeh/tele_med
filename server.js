const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const User = require('./Models/user'); 
const appointmentRoutes = require('./routes/appointment');  
const { isAuthenticated } = require('./Middleware/auth');
const Appointment = require('./Models/Appointment');
require('dotenv').config();



const LocalStrategy = require('passport-local').Strategy;
const app = express();

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.isAuthenticated() ? req.user : null; 
    next();
});

// Passport configuration
passport.use(new LocalStrategy(
    { usernameField: 'email' }, 
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Incorrect email.' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));

// Routes
app.use('/appointment', appointmentRoutes); 

app.get('/book-appointment', isAuthenticated, (req, res) => {
    res.render('book-appointment', { userId: req.user._id });
});

// Appointment Routes
app.post('/book-appointment', isAuthenticated, async (req, res) => {
    const { date, time, reason } = req.body;
    try {
        const newAppointment = new Appointment({
            date,
            time,
            reason,
            patient: req.user._id 
        });
        
        await newAppointment.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error booking appointment:', error.message);
        res.status(500).send('Error booking appointment');
    }
});

// Fetch user's booked appointments
app.get('/my-appointments', isAuthenticated, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id });
        res.render('my-appointments', { appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/login', (req, res) => {
    res.render('login'); 
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signup',
}));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send('User already exists with this email address');
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login'); 
    });
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});