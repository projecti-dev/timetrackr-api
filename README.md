# TimeTrackr API 🛠️

NestJS REST API backend for the TimeTrackr application.

## Tech Stack

- NestJS
- PostgreSQL
- TypeORM
- JWT Authentication
- bcrypt
- class-validator

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation

```bash
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=timetrackr
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=3001
```

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE timetrackr;"
```

Seed default users:

```bash
npx ts-node src/seed.ts
```

Start in development mode:

```bash
npm run start:dev
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login with username and password |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /sessions/entry | Add a new time entry |
| GET | /sessions/entries | Get all entries for authenticated user |
| DELETE | /sessions/entry/:id | Delete an entry by ID |
| GET | /sessions/stats | Get daily, weekly, monthly totals |

## Project Structure
