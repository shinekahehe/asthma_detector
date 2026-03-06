# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for the Asthma Predictor backend.

## Prerequisites

- PostgreSQL 12+ installed on your system
- Administrator access to PostgreSQL
- The password for the setup is: `priyarohan`

## Step 1: Create PostgreSQL User

On Windows, open **psql** (PostgreSQL Command Line) as Administrator:

```sql
-- Create the 'postgres' user with password 'priyarohan'
-- (if not already set up)
ALTER USER postgres WITH PASSWORD 'priyarohan';
```

Or if creating a new user:

```sql
CREATE USER postgres WITH PASSWORD 'priyarohan';
ALTER USER postgres CREATEDB;
```

## Step 2: Create Database

Still in psql, create the database:

```sql
-- Create the asthma_db database
CREATE DATABASE asthma_db
    OWNER postgres
    ENCODING 'UTF8'
    LC_COLLATE 'C'
    LC_CTYPE 'C';

-- Verify the database was created
\l
```

## Step 3: Connect to Database

```sql
-- Connect to the new database
\c asthma_db

-- Verify connection
SELECT version();
```

## Step 4: Verify Connection String

The connection string in `.env` should be:

```
DATABASE_URL=postgresql://postgres:priyarohan@localhost:5432/asthma_db
```

## Step 5: Initialize Flask App

Once PostgreSQL is running and the database is created, the Flask app will automatically create tables on startup:

```bash
cd asthma_backend
python app.py
```

You should see:
```
[db] PostgreSQL tables ready.
[app] Starting Asthma Predictor API on http://0.0.0.0:5000
```

## Tables Created Automatically

### users
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100))
- `email` (VARCHAR(255) UNIQUE)
- `password_hash` (VARCHAR(255))
- `role` (VARCHAR(20) - 'patient' or 'caretaker')
- `linked_patient_id` (INTEGER - for caretaker to link to patient)
- `created_at` (TIMESTAMP)

### predictions
- `id` (SERIAL PRIMARY KEY)
- `patient_id` (INTEGER - REFERENCES users)
- `patient_name` (VARCHAR(100))
- `status` (VARCHAR(20) - 'normal', 'mild', 'attack')
- `confidence` (FLOAT)
- `raw_probabilities` (JSONB)
- `created_at` (TIMESTAMP)

## Testing the Setup

### 1. Register a Patient

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

Expected response:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "token": "eyJ0eXAiOiJKV1QiLC..."
}
```

### 2. Register a Caretaker

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Caretaker",
    "email": "jane@example.com",
    "password": "password123",
    "role": "caretaker"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Link Caretaker to Patient

```bash
curl -X POST http://localhost:5000/api/auth/link-patient \
  -H "Content-Type: application/json" \
  -d '{
    "caretaker_id": 2,
    "patient_email": "john@example.com"
  }'
```

### 5. Make a Prediction

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": [0.1, 0.2, 0.3, 0.4],
    "patient_name": "John Doe",
    "patient_id": 1
  }'
```

### 6. Get Patient History (Authenticated)

```bash
curl -X GET http://localhost:5000/api/patient-history/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Connection Refused
- Verify PostgreSQL service is running
- Check PostgreSQL port (default: 5432)
- Verify DATABASE_URL in `.env`

### Authentication Failed
- Verify password is `priyarohan`
- Check that user `postgres` exists
- Try re-creating the user with the correct password

### Permission Denied
- Ensure `postgres` user has CREATEDB privilege
- Check database ownership

### Tables Not Created
- Check Flask app logs for database errors
- Verify `.env` DATABASE_URL is correct
- Ensure psycopg2 is installed: `pip install psycopg2-binary`

## Resetting the Database

To start fresh, you can drop and recreate the database:

```sql
-- Drop existing database (WARNING: deletes all data)
DROP DATABASE IF EXISTS asthma_db;

-- Recreate empty database
CREATE DATABASE asthma_db
    OWNER postgres
    ENCODING 'UTF8';
```

Then restart the Flask app to recreate tables.

## Next Steps

1. Frontend should connect to `http://localhost:5000/api`
2. Users can register and login
3. The h5 model at `asthma_backend/model/asthma_wheeze_model.h5` will automatically load and make predictions
4. Predictions are stored in the `predictions` table
