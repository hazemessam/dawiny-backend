# Dawiny Backend
Dawiny is a healthcare mobile app that connects patients, doctors, and nurses with each other.

## Table of Content
- [Tech Stack](#tech-stack)
- [Server Setup](#server-setup)
- [API Endpoints](#api-endpoints)

## Tech Stack
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.IO](https://socket.io/)
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

#### 4. Set the environment variable `DB_URI` to your database uri

#### 5. Run the server
```bash
$ npm start
```

#### 6. Now check http://localhost:8080/

## API Endpoints
| Method | Endpoint | Description |
| - | - | - |
| GET | /api/patients | Get all patients |
| GET | /api/patients/:id | Get a patient by its id
| POST | /api/patients | Create a new patient |
| PATCH | /api/patients/:id | Update a patient by its id |
| DELETE | /api/patients/:id | Delete a patient by its id |
| GET | /api/doctors | Get all doctors |
| GET | /api/doctors/:id | Get a doctor by its id
| POST | /api/doctorss | Create a new doctor |
| PATCH | /api/doctorss/:id | Update a doctor by its id |
| DELETE | /api/doctorss/:id | Delete a doctor by its id |
| GET | /api/nurses | Get all nurses |
| GET | /api/nurses/:id | Get a nurse by its id
| POST | /api/nurses | Create a new nurse |
| PATCH | /api/nurses/:id | Update a nurse by its id |
| DELETE | /api/nurses/:id | Delete a nurse by its id |

