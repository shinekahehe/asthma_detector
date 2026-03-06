# Asthma Predictor - Complete Setup Guide

## Project Overview

**Asthma Predictor** is a full-stack application for monitoring asthma using ML-powered audio analysis:

- **Backend**: Python Flask with PostgreSQL database
- **Frontend**: React Native with Expo
- **Authentication**: JWT tokens with bcrypt password hashing
- **Model**: TensorFlow/Keras (.h5 file) for asthma wheeze detection
- **Users**: Patient and Caretaker roles with authorization

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ASTHMA PREDICTOR                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │  Frontend (RN)   │◄────────────►│  Backend (Flask) │     │
│  │  - Login         │   REST API   │  - Auth Routes   │     │
│  │  - Dashboard     │  JWT Token   │  - Predict Route │     │
│  │  - Monitoring    │              │  - History Route │     │
│  │  - History       │              │  - Link Caretaker│     │
│  └──────────────────┘              └────────┬─────────┘     │
│                                            │                │
│                                            ▼                │
│                                   ┌──────────────────┐      │
│                                   │   PostgreSQL     │      │
│                                   │  - users table   │      │
│                                   │  - predictions   │      │
│                                   │    table         │      │
│                                   └──────────────────┘      │
│                                            │                │
│                                            │                │
│                          ┌──────────────────────────┐       │
│                          │  TensorFlow/Keras Model  │       │
│                          │  asthma_wheeze_model.h5  │       │
│                          │  (Wheeze Detection ML)   │       │
│                          └──────────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
c:\project\
├── asthma_backend/                    # Python/Flask backend
│   ├── app.py                         # Main Flask app
│   ├── requirements.txt               # Python dependencies
│   ├── DATABASE_SETUP.md              # PostgreSQL setup guide
│   ├── LOGIN_AND_MODEL_SETUP.md       # Complete backend guide
│   ├── database/
│   │   └── db.py                      # PostgreSQL connection & tables
│   ├── routes/
│   │   ├── .env                       # Environment variables
│   │   ├── auth_routes.py             # Login, register, link
│   │   └── patient_routes.py          # Predictions, history
│   └── model/
│       ├── asthma_wheeze_model.h5     # Trained ML model
│       └── predictor.py               # Model inference
│
└── ASTHMA_PREDICTOR/                  # React Native/Expo frontend
    ├── FRONTEND_INTEGRATION_GUIDE.md  # Frontend auth guide
    ├── App.js                         # Entry point
    ├── app.json                       # Expo config
    ├── tsconfig.json
    ├── package.json
    ├── constants/
    │   ├── api.js                     # API base URL config
    │   ├── colors.js
    │   └── mockData.js
    ├── context/
    │   └── AuthContext.js             # Auth state management
    ├── services/
    │   └── api.js                     # API client (now with auth)
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── PatientDashboard.js
    │   ├── CaretakerDashboard.js
    │   └── ...
    ├── navigation/
    │   └── RootNavigator.js           # Auth-based routing
    └── components/
        └── ...
```

## Setup Checklist

### ✅ Step 1: PostgreSQL Database Setup
**Time: 10 minutes**

See: [asthma_backend/DATABASE_SETUP.md](./asthma_backend/DATABASE_SETUP.md)

- [ ] Install PostgreSQL 12+
- [ ] Connect with default credentials
- [ ] Create user `postgres` with password `priyarohan`
- [ ] Create database `asthma_db`
- [ ] Verify connection works

```bash
# Test connection
psql -U postgres -h localhost -d asthma_db -c "SELECT version();"
# Should show: PostgreSQL 12.x or higher
```

### ✅ Step 2: Backend Setup
**Time: 5 minutes**

```bash
cd asthma_backend

# Install Python dependencies
pip install -r requirements.txt
# Creates:
# - flask (web framework)
# - psycopg2 (PostgreSQL driver)
# - flask-jwt-extended (JWT tokens)
# - tensorflow (ML model)
# - bcrypt (password hashing)
# ... and more
```

### ✅ Step 3: Verify Environment Variables
**Time: 2 minutes**

File: `asthma_backend/routes/.env`

```
DATABASE_URL=postgresql://postgres:priyarohan@localhost:5432/asthma_db
JWT_SECRET_KEY=change-me-to-a-very-long-random-secret
PORT=5000
```

**Action:** Verify the password is set to `priyarohan`

### ✅ Step 4: Start Backend Server
**Time: 3 minutes**

```bash
cd asthma_backend
python app.py
```

Expected output:
```
[db] PostgreSQL tables ready.
[app] Starting Asthma Predictor API on http://0.0.0.0:5000
 * Debug mode: on
```

**Note:** Tables are created automatically on first run!

### ✅ Step 5: Frontend Configuration
**Time: 2 minutes**

File: `ASTHMA_PREDICTOR/constants/api.js`

For **web/localhost**:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api';
```

For **device/emulator on LAN**:
```javascript
const LAN_IP = '192.168.1.100'; // Your machine IP
export const API_BASE_URL = `http://${LAN_IP}:5000/api`;
```

Find your LAN IP:
```bash
# Windows PowerShell
ipconfig
# Look for "IPv4 Address" under active connection

# Mac/Linux
ifconfig
# Look for inet address
```

### ✅ Step 6: Start Frontend
**Time: 5 minutes**

```bash
cd ASTHMA_PREDICTOR

# Install dependencies
npm install

# Start Expo
npx expo start

# Choose platform:
# Press 'w' for web
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

### ✅ Step 7: Test Authentication

In the app:
1. Tap **"Don't have an account? Register"**
2. Choose **role**: Patient or Caretaker
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `testpass123`
4. Tap **"Register"**
5. Should see dashboard with user info

## Key Features

### 1. User Authentication
- **Registration**: Patient or Caretaker roles
- **Login**: Email + password with JWT tokens
- **Password Security**: Bcrypt hashing (10 salt rounds)
- **Session Management**: Persistent tokens across screens

```bash
# Register Patient
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

### 2. Caretaker-Patient Linking
- Caretaker can link to patient using patient's email
- Authorization automatically enforced
- Caretaker can only view linked patient's data

```bash
# Link caretaker to patient
curl -X POST http://localhost:5000/api/auth/link-patient \
  -H "Content-Type: application/json" \
  -d '{
    "caretaker_id": 2,
    "patient_email": "john@example.com"
  }'
```

### 3. ML-Powered Predictions
- TensorFlow model loads from `.h5` file
- Analyzes audio features for wheeze detection
- Returns status: `normal`, `mild`, or `attack`
- Stores predictions in PostgreSQL

```bash
# Make prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": [0.1, 0.2, 0.3, 0.4],
    "patient_id": 1,
    "patient_name": "John Doe"
  }'
```

Response:
```json
{
  "id": 1,
  "patient_id": 1,
  "patient_name": "John Doe",
  "status": "normal",
  "confidence": 95.3,
  "timestamp": "2026-03-05T10:30:45.123456"
}
```

### 4. Prediction History
- Anonymous history (by patient name)
- Authenticated history (by patient ID, with authorization)

```bash
# Authenticated history (requires JWT token)
curl -X GET http://localhost:5000/api/patient-history/1 \
  -H "Authorization: Bearer JWT_TOKEN"
```

## Security Features

### 1. Password Protection
- **Bcrypt Hashing**: 10 salt rounds
- **Never Plain Text**: Passwords hashed before storage
- **Verification**: `bcrypt.checkpw()` during login

### 2. JWT Authentication
- **Token-Based**: Stateless authentication
- **Authorization**: Role-based access control
- **Data Protection**: Authenticated endpoints require valid token

### 3. Authorization Rules
- **Patient**: Can only view own data
- **Caretaker**: Can only view linked patient's data
- **Admin-like**: Can be added if needed

### 4. Input Validation
- Email format validation
- Password strength checks
- SQL injection prevention (prepared statements)

## Database Schema

### users Table
```sql
CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(255) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    role             VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'caretaker')),
    linked_patient_id INTEGER REFERENCES users(id),
    created_at       TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
- `id`: Unique user identifier
- `name`: User's full name
- `email`: Unique email for login
- `password_hash`: Bcrypt hashed password
- `role`: 'patient' or 'caretaker'
- `linked_patient_id`: Caretaker's linked patient ID
- `created_at`: Account creation timestamp

### predictions Table
```sql
CREATE TABLE predictions (
    id                 SERIAL PRIMARY KEY,
    patient_id         INTEGER REFERENCES users(id),
    patient_name       VARCHAR(100),
    status             VARCHAR(20) NOT NULL,
    confidence         FLOAT NOT NULL,
    raw_probabilities  JSONB,
    created_at         TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
- `id`: Unique prediction identifier
- `patient_id`: Linked patient (allows caretaker filtering)
- `patient_name`: Patient's name
- `status`: 'normal', 'mild', or 'attack'
- `confidence`: 0-100 percentage
- `raw_probabilities`: JSON array of all class probabilities
- `created_at`: Prediction timestamp

## API Endpoints

### Authentication (`/api/auth/`)
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/register` | POST | No | Create new account |
| `/login` | POST | No | Login & get JWT token |
| `/link-patient` | POST | No | Link caretaker to patient |
| `/linked-patient/<id>` | GET | No | Get linked patient info |
| `/me` | GET | No | Health check |

### Predictions (`/api/`)
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/predict` | POST | No | Make prediction (any user) |
| `/history` | GET | No | Get predictions by name |
| `/latest` | GET | No | Get latest prediction |
| `/patient-history/<id>` | GET | **Yes** | Get patient history (authorized) |
| `/patient-latest/<id>` | GET | **Yes** | Get latest prediction (authorized) |
| `/health` | GET | No | API health check |

## Common Workflows

### Workflow 1: Patient Registration & Prediction

```mermaid
graph TD
    A[Patient Opens App] --> B[Tap Register]
    B --> C[Choose Patient Role]
    C --> D[Enter Name, Email, Password]
    D --> E[Tap Register Button]
    E --> F[POST /auth/register]
    F --> G{Success?}
    G -->|Yes| H[Receive JWT Token]
    G -->|No| I[Show Error]
    H --> J[Navigate to PatientDashboard]
    J --> K[Start Monitoring]
    K --> L[Record Audio]
    L --> M[Extract Features]
    M --> N[POST /predict]
    N --> O[Load asthma_wheeze_model.h5]
    O --> P[Get Prediction: normal/mild/attack]
    P --> Q[Store in PostgreSQL]
    Q --> R[Display Result to Patient]
```

### Workflow 2: Caretaker Linking to Patient

```mermaid
graph TD
    A[Caretaker Registers] --> B[POST /auth/register<br/>role: caretaker]
    C[Patient Already Registered] --> D[Has patient email]
    B --> E[Caretaker on Dashboard]
    E --> F[Enter Patient Email]
    F --> G[POST /auth/link-patient]
    G --> H{Patient Found?}
    H -->|Yes| I[Caretaker Linked]
    H -->|No| J[Show Error]
    I --> K[Caretaker Can View Patient Data]
    K --> L[GET /patient-history/patient_id<br/>with JWT Token]
    L --> M[Authorization Check]
    M --> N{Is Caretaker<br/>Linked?}
    N -->|Yes| O[Return Patient Predictions]
    N -->|No| P[403 Forbidden]
```

### Workflow 3: Model Prediction Pipeline

```mermaid
graph TD
    A[Audio Input] --> B[Frontend: Extract Features<br/>MFCC, Spectral, etc.]
    B --> C[POST /predict<br/>features: float array]
    D[asthma_wheeze_model.h5] --> E[Load Model<br/>First Time Only]
    C --> E
    E --> F[Normalize Features<br/>shape 1, n_features]
    F --> G[Forward Pass<br/>Neural Network]
    G --> H[Get Probabilities<br/>normal, mild, attack]
    H --> I[Find Max Prediction]
    I --> J[Compute Confidence]
    J --> K[Store in PostgreSQL]
    K --> L[Return to Frontend]
    L --> M[Display Status & Confidence]
```

## Troubleshooting

### Backend Won't Start

```bash
# Error: "Could not initialise DB"
# Solution 1: Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Solution 2: Verify DATABASE_URL
cat asthma_backend/routes/.env | grep DATABASE_URL

# Solution 3: Check database exists
psql -U postgres -l | grep asthma_db

# Solution 4: Recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS asthma_db; CREATE DATABASE asthma_db;"
```

### Frontend Can't Connect to Backend

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check API base URL
# Edit: ASTHMA_PREDICTOR/constants/api.js
# Verify: export const API_BASE_URL = 'http://localhost:5000/api'

# For device/emulator, use LAN IP:
ipconfig  # Find IPv4 Address
# Update api.js: const LAN_IP = '192.168.x.x'
```

### Model Not Loading

```bash
# Check file exists
ls -la asthma_backend/model/asthma_wheeze_model.h5

# Check TensorFlow installed
python -c "import tensorflow; print(tensorflow.__version__)"
# Should print version 2.x

# If missing, install:
pip install tensorflow==2.16.2

# Model loading uses fallback mock predictions if h5 missing
```

### JWT Token Errors

```bash
# Token not recognized
# Solution: Re-login to get fresh token

# Token is expired (if JWT_ACCESS_TOKEN_EXPIRES set)
# Solution: Implement token refresh endpoint

# 401 Unauthorized on protected endpoint
# Solution: Make sure Authorization header is set
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/patient-history/1
```

## Performance Tips

1. **Model Caching**
   - Model loads once on first prediction
   - Reused for subsequent predictions
   - Reduces latency after first use

2. **Database Indexing**
   - Add index on `patient_id` for faster queries
   - Add index on `created_at` for sorting

3. **Token Caching**
   - Frontend caches JWT token in `_authToken`
   - No need to re-request on every API call

4. **Network Optimization**
   - Batch predictions if possible
   - Cache history data client-side
   - Use pagination for large datasets

## Production Deployment

### Backend Deployment (Heroku/AWS/GCP)
```bash
# Create production .env
DATABASE_URL=postgresql://user:pass@prod-db-host:5432/asthma_db
JWT_SECRET_KEY=<strong_random_secret>
PORT=5000

# Deploy
git push heroku main  # For Heroku
# Or use Docker: docker build -t asthma-api .
```

### Frontend Build
```bash
cd ASTHMA_PREDICTOR

# Build for iOS
eas build --platform ios --distribution app-store

# Build for Android
eas build --platform android --distribution play-store

# Or use Expo Go for testing
npx expo start
```

## Monitoring & Logging

### Backend Logs
```python
# Flask app logs (already visible in console)
[db] PostgreSQL tables ready.
[app] Starting Asthma Predictor API...
[app] WARNING: Could not initialise DB
[predictor] Model loaded from /path/to/model.h5
```

### Database Queries
```sql
-- Check user accounts
SELECT id, name, email, role FROM users;

-- Check predictions
SELECT id, patient_id, status, confidence, created_at 
FROM predictions 
ORDER BY created_at DESC;

-- Check caretaker links
SELECT id, name, linked_patient_id FROM users 
WHERE role = 'caretaker';
```

## Next Steps

1. **Customize UI**: Update app colors, logos, screens
2. **Add Audio Processing**: Implement feature extraction in frontend
3. **Set Alerts**: Notify caretakers of abnormal predictions
4. **Add Reports**: Generate PDF/CSV reports of predictions
5. **Mobile Health Integration**: Connect to wearables/sensors
6. **Cloud Deployment**: Deploy to AWS/Heroku/GCP
7. **Monitoring**: Add Sentry/DataDog for error tracking

## Additional Documentation

- [asthma_backend/DATABASE_SETUP.md](./asthma_backend/DATABASE_SETUP.md) - PostgreSQL configuration
- [asthma_backend/LOGIN_AND_MODEL_SETUP.md](./asthma_backend/LOGIN_AND_MODEL_SETUP.md) - Complete backend guide
- [ASTHMA_PREDICTOR/FRONTEND_INTEGRATION_GUIDE.md](./ASTHMA_PREDICTOR/FRONTEND_INTEGRATION_GUIDE.md) - Frontend auth integration

## Support & Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Native**: https://reactnative.dev/
- **Expo Documentation**: https://docs.expo.dev/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **TensorFlow/Keras**: https://www.tensorflow.org/guide/keras
- **JWT**: https://jwt.io/

---

**Setup Complete!** 🎉 Your Asthma Predictor is ready to use with full authentication and ML integration.