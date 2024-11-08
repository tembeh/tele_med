 Beta Telemedics

Beta Telemedics is a web-based telemedicine application that allows users to book medical appointments, consult with healthcare providers, and access a range of telehealth services online.

Overview

Beta Telemedics aims to make healthcare accessible by connecting patients and providers in a virtual setting. Users can book appointments, view medical records, and consult with licensed healthcare professionals securely and conveniently.

Features

User authentication and authorization
Appointment booking and management
User profile with upcoming appointments and medical history
Passport.js for secure login
Responsive design for mobile and desktop devices

Tech Stack

Frontend: HTML, CSS, JavaScript, EJS
Backend: Node.js, Express.js
Database: MongoDB
Authentication: Passport.js
Session Handling: Express-Session
Installation
Clone the repository:

git clone https://github.com/luka003-hub/tele_medicine.git
cd tele_medicine



Usage

Login/Register: Use the login page to sign in or register.
Book Appointment: Once logged in, navigate to the appointment booking page.
View Appointments: Access the "My Appointments" section to see upcoming and past appointments.

API Routes

POST /appointments/book-appointment: Books an appointment (requires authentication).
GET /appointments: Fetches all appointments for the logged-in user.
POST /auth/login: Authenticates and logs in a user.
POST /auth/signup: Registers a new user.


Fork the repository.
Create a new branch (feature/your-feature-name).
Commit your changes and push to your fork.
Submit a pull request.