# ClinicSphere

**ClinicSphere** is a modern, role-based healthcare management system designed for clinics to streamline patient bookings, appointments, doctor dashboards, and more.

> This project is under active development.

---

## Project Status

-  Frontend landing page with mock data
-  Role-based login and sidebar (Admin, Doctor, Patient)
-  NestJS backend with Auth & User modules
-  Appointment booking and dashboards in progress

---

## Tech Stack

| Layer     | Stack                       |
|-----------|-----------------------------|
| Frontend  | Next.js, Tailwind CSS, React Icons |
| Backend   | NestJS, MongoDB, JWT        |
| Auth      | Role-based login system     |
| UI/UX     | Framer Motion, Headless UI  |

---

## Features

### Current Features
#### Frontend (Next.js)
- Landing page with:
  - Hero section
  - Top Specialists
  - Top Doctors
  - Testimonials
  - Footer
- Auth:
  - Login/Register for Admin, Doctor, Patient
- Role-based dashboard layout with dynamic sidebars

#### Backend (NestJS)
- JWT-based Authentication
- User roles: Admin, Doctor, Patient
- Basic Admin and User API routes

---

###  In Progress
- Doctor dashboard with:
  - Patient overview
  - Appointment calendar
- Admin dashboard:
  - Doctor/Patient management
  - Reports & stats
- Appointment booking (Patient → Doctor)
- Medical history management

---

## Local Development Setup

### Clone the Repositories


# Frontend
```bash
git clone https://github.com/maheshbhatiya73/clinicsphere-frontend.git

```

# Backend
```bash
git clone https://github.com/maheshbhatiya73/clinicsphere-backend.git
```

### Run Backend
```bash
cd clinicsphere-backend
npm install
npm run start:dev
```
Configure your .env file for MongoDB URI and JWT secrets.


### Run Frontend
```bash
cd clinicsphere-frontend
npm install
npm run dev
```
### Upcoming Features
###### Multi-clinic support
###### Prescription PDF generation
###### Secure file uploads (labs/reports)
###### Notifications & email/SMS reminders
###### Payment gateway integration (Razorpay/Stripe)

## Contributing
Pull requests are welcome. Contribution guide will be added soon.

Made with ❤️ by Mahesh Bhatiya
