# Login System & Model Integration Setup Guide

## Overview

The Asthma Predictor application now has:
- ✅ PostgreSQL database with user authentication
- ✅ JWT token-based authentication for secure API access
- ✅ Patient and Caretaker roles with authorization
- ✅ TensorFlow/Keras (.h5) model integration for asthma predictions
- ✅ Bcrypt password hashing for security

## Quick Start

### 1. Install Dependencies

```bash
cd asthma_backend
pip install -r requirements.txt
```

**Required packages:**
- `flask` - Web framework
- `flask-cors` - Cross-origin requests
- `flask-jwt-extended` - JWT authentication
- `psycopg2-binary` - PostgreSQL driver
- `python-dotenv` - Environment variables
- `bcrypt` - Password hashing
- `tensorflow` - ML framework (for .h5 model)
- `numpy`, `librosa`, `scikit-learn` - ML dependencies

### 2. Set Up PostgreSQL

Follow the [DATABASE_SETUP.md](./DATABASE_SETUP.md) guide to:
- Create PostgreSQL database
- Set password to `priyarohan`
- Tables will auto-initialize on app start

### 3. Verify .env Configuration

The file `asthma_backend/routes/.env` should contain:

```
DATABASE_URL=postgresql://postgres:priyarohan@localhost:5432/asthma_db
JWT_SECRET_KEY=change-me-to-a-very-long-random-secret
PORT=5000
```

**For production:** Change `JWT_SECRET_KEY` to a secure random string.

### 4. Start the Backend Server

```bash
cd asthma_backend
python app.py
```

You should see:
```
[db] PostgreSQL tables ready.
[app] Starting Asthma Predictor API on http://0.0.0.0:5000
```

### 5. Configure Frontend

Update `ASTHMA_PREDICTOR/constants/api.js`:

```javascript
// For web: localhost:5000
// For device/emulator: your machine's LAN IP:5000
export const API_BASE_URL = 'http://localhost:5000/api';
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user (patient or caretaker)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Rohan",
    "email": "priya@example.com",
    "password": "secure_password",
    "role": "patient"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "name": "Priya Rohan",
    "email": "priya@example.com",
    "role": "patient"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### POST `/api/auth/login`
Login with email and password

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "priya@example.com",
    "password": "secure_password"
  }'
```

#### POST `/api/auth/link-patient` (Caretaker Only)
Link a caretaker account to a patient

```bash
curl -X POST http://localhost:5000/api/auth/link-patient \
  -H "Content-Type: application/json" \
  -d '{
    "caretaker_id": 2,
    "patient_email": "priya@example.com"
  }'
```

#### GET `/api/auth/linked-patient/<caretaker_id>`
Retrieve patient linked to a caretaker

```bash
curl http://localhost:5000/api/auth/linked-patient/2
```

### Prediction Endpoints

#### POST `/api/predict`
Make a prediction (no auth required - for quick testing)

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": [0.1, 0.2, 0.3, 0.4],
    "patient_name": "Priya Rohan",
    "patient_id": 1
  }'
```

Response:
```json
{
  "id": 1,
  "patient_id": 1,
  "patient_name": "Priya Rohan",
  "status": "normal",
  "confidence": 95.3,
  "timestamp": "2026-03-05T10:30:45.123456"
}
```

**Status values:**
- `normal` - No wheeze detected (confidence 90-99%)
- `mild` - Mild asthma symptoms (confidence 60-80%)
- `attack` - Severe asthma attack (confidence 80-95%)

#### GET `/api/history`
Get prediction history (no auth required)

```bash
curl http://localhost:5000/api/history?patient_id=1&limit=20
```

#### GET `/api/patient-history/<patient_id>`
Get patient history (requires JWT token & authorization)

```bash
curl http://localhost:5000/api/patient-history/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Authorization rules:**
- Patients can only view their own data
- Caretakers can only view their linked patient's data

#### GET `/api/latest`
Get latest prediction (no auth required)

```bash
curl http://localhost:5000/api/latest?patient_id=1
```

#### GET `/api/patient-latest/<patient_id>`
Get latest prediction with auth (requires JWT token)

```bash
curl http://localhost:5000/api/patient-latest/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Model Integration

### Model File
- Located at: `asthma_backend/model/asthma_wheeze_model.h5`
- Format: Keras/TensorFlow (.h5)
- Automatically loads on first prediction request
- Supports 3 classes: normal, mild, attack

### Feature Input
The model expects a feature vector as input. Audio features are extracted from patient's breathing patterns.

**Example feature extraction (frontend):**
```javascript
// Extract features from audio recording
const features = [ /* audio features */ ];
const response = await predict(features, patientName, patientId);
```

**Expected features:**  
The model was trained on librosa audio features. Typical input is a 1D array of numerical values representing:
- MFCC (Mel-frequency cepstral coefficients)
- Spectral features
- Temporal characteristics

### Model Prediction Process

1. **Receive features** → `/api/predict` endpoint
2. **Load model** → Lazy-load `asthma_wheeze_model.h5` (first time only)
3. **Normalize** → Convert to proper shape (1, n_features)
4. **Predict** → Get probability predictions
5. **Classify** → Find highest probability class
6. **Store** → Save prediction to PostgreSQL
7. **Return** → Status, confidence, and probabilities

### Fallback Mode
If the model file is missing or TensorFlow unavailable:
```
WARNING: TensorFlow not available. Using mock predictions.
```

Mock predictions return random values for testing without the model.

## User Roles & Access Control

### Patient Role
- Create account and log in
- View own prediction history
- Receive monitoring alerts
- Cannot view other patients' data

### Caretaker Role
- Create account and log in
- Link to a patient using patient's email
- View linked patient's prediction history
- Monitor linked patient's breathing patterns
- Receive alerts for linked patient

## Password Security

- All passwords hashed with **bcrypt** (salt rounds: 10)
- Never stored in plain text
- Passwords checked during login: `bcrypt.checkpw()`
- Minimum 6 characters recommended (enforced in frontend)

## JWT Token

- Generated on login/register
- Contains user ID, name, and role
- Used for authenticated endpoints
- No expiration in development (change in production!)

**Setting token on frontend:**
```javascript
const { user, token } = await loginUser(email, password);
setAuthToken(token); // Store in API service
```

**Using token in requests:**
```javascript
// Automatically added to request headers
headers['Authorization'] = `Bearer ${token}`;
```

## Testing Workflow

### Scenario 1: Patient Login & View History
```bash
# 1. Register patient
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Patient",
    "email": "alice@example.com",
    "password": "password123",
    "role": "patient"
  }'
# Save the token

# 2. Make predictions
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": [0.1, 0.2, 0.3, 0.4],
    "patient_id": 1,
    "patient_name": "Alice Patient"
  }'

# 3. View authenticated history
curl http://localhost:5000/api/patient-history/1 \
  -H "Authorization: Bearer TOKEN_FROM_STEP_1"
```

### Scenario 2: Caretaker Monitoring Patient
```bash
# 1. Register caretaker
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Caretaker",
    "email": "bob@example.com",
    "password": "password123",
    "role": "caretaker"
  }'
# Save the caretaker token and ID (should be 2)

# 2. Link to patient
curl -X POST http://localhost:5000/api/auth/link-patient \
  -H "Content-Type: application/json" \
  -d '{
    "caretaker_id": 2,
    "patient_email": "alice@example.com"
  }'

# 3. View patient's history with caretaker token
curl http://localhost:5000/api/patient-history/1 \
  -H "Authorization: Bearer CARETAKER_TOKEN"

# If caretaker tries to access different patient:
# Response: 403 Unauthorized
```

## Environment Variables Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `postgresql://postgres:priyarohan@localhost:5432/asthma_db` | PostgreSQL connection |
| `JWT_SECRET_KEY` | `change-me-to-a-very-long-random-secret` | JWT signing key |
| `PORT` | `5000` | Flask server port |

## Production Checklist

- [ ] Change `JWT_SECRET_KEY` to strong random string
- [ ] Use environment-specific DATABASE_URL
- [ ] Set `JWT_ACCESS_TOKEN_EXPIRES` to reasonable value
- [ ] Enable HTTPS in production
- [ ] Use secure database passwords
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Set up logging and monitoring
- [ ] Use proper CORS settings (not `*`)
- [ ] Add database backups

## Troubleshooting

### "Could not initialise DB" Error
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Verify password is correct (priyarohan)

### "Model not found" Warning
- Check `asthma_backend/model/asthma_wheeze_model.h5` exists
- TensorFlow will use mock predictions as fallback

### 401 Unauthorized on Prediction
- Token may be expired or invalid
- Re-login to get new token
- Check `Authorization` header is properly formatted

### 403 Forbidden on Patient History
- Patient cannot view other patient's data
- Caretaker must be linked to patient
- Check `linked_patient_id` in database

## Resources

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - PostgreSQL configuration
- [Flask JWT Documentation](https://flask-jwt-extended.readthedocs.io/)
- [TensorFlow/Keras Model Guide](https://www.tensorflow.org/guide/keras)
- [bcrypt Documentation](https://github.com/pyca/bcrypt)