# Dawiny Backend
Dawiny is a healthcare mobile app connects patients, doctors, and nurses with each other.

## Table of Content
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Server Setup](#server-setup)
- [API Endpoints](#api-endpoints)

## Features
- CRUD operations on patients, doctors and nurses.
- Register and login users.
- Authentication and authorization services.
- Patient can find the nearest 10 nurses to his location.
- Patient can book an appointment with a doctor.
- File upload service.
- CI/CD pipeline using GitHub Actions.

## Tech Stack
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)
- [Heroku](https://www.heroku.com/)

## Server Setup
#### 1. Clone the repo
```bash
$ git clone https://github.com/hazemessam/dawiny-backend.git
```

#### 2. Move to the project directory
```bash
$ cd dawiny-backend/
```

#### 3. Install the dependances
```bash
$ npm install
```

#### 4. Set the following environment variables 
- `DB_URI`,
- `ACCESS_SECRET`,
- `REFRESH_SECRET`,
- `CLOUDINARY_CLOUD_NAME`,
- `CLOUDINARY_API_KEY`,
- `CLOUDINARY_API_SECRET`

#### 5. Run the server
```bash
$ npm start
```

#### 6. Now check http://localhost:8080/

## API Endpoints
| Method | Endpoint | Description |
| - | - | - |
| GET | /api/patients/:id | Get a patient by its id. |
| POST | /api/patients | Create a new patient. |
| PATCH | /api/patients/:id | Update a patient by its id. |
| DELETE | /api/patients/:id | Delete a patient by its id. |
| GET | /api/patients/:id/reservations | Get a patient reservations using its id. |
| GET | /api/doctors | Get all doctors. |
| GET | /api/doctors/:id | Get a doctor by its id. |
| POST | /api/doctors | Create a new doctor. |
| PATCH | /api/doctors/:id | Update a doctor by its id. |
| DELETE | /api/doctors/:id | Delete a doctor by its id. |
| GET | /api/doctors/:id/reservations | Get a doctor reservations using its id. |
| POST | /api/doctors/:id/reservations | Book an appointment with a doctor using its id. |
| POST | /api/doctors/:id/reservations?check=true | Check if a doctor appointment is available or not. |
| GET | /api/nurses | Get all nurses. |
| GET | /api/nurses?lat=:lat&lng=:lng | Get the top 10 nearest nurses to the specified location. |
| GET | /api/nurses/:id | Get a nurse by its id. |
| POST | /api/nurses | Create a new nurse. |
| PATCH | /api/nurses/:id | Update a nurse by its id. |
| DELETE | /api/nurses/:id | Delete a nurse by its id. |
| POST | /api/auth/login | Login a user. |
| POST | /api/auth/token | Generate a new access token using the refresh token. |
| POST | /api/upload | Upload a file. |
