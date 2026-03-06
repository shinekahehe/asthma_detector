# Frontend Integration Guide - Authentication & Model

This guide explains how the frontend connects with the PostgreSQL login system and h5 model.

## Quick Start

### 1. Configure API Base URL

Edit `ASTHMA_PREDICTOR/constants/api.js`:

```javascript
// For local development (web):
export const API_BASE_URL = 'http://localhost:5000/api';

// For device/emulator on your LAN:
const LAN_IP = '192.168.x.x'; // Replace with your machine's IP
export const API_BASE_URL = `http://${LAN_IP}:5000/api`;
```

### 2. Start the App

```bash
cd ASTHMA_PREDICTOR
npm install
npx expo start
```

Then:
- Press `w` for web
- Press `i` for iOS emulator
- Press `a` for Android emulator

### 3. Test Login

In the app:
1. Tap "Don't have an account? Register"
2. Choose role: Patient or Caretaker
3. Fill in name, email, password
4. Tap "Register"
5. You should be logged in

## Auth Flow

### Login/Registration
```
┌─────────────────┐
│ Auth Screen     │
│ (Email/Pass)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ POST /auth/login or         │
│ POST /auth/register         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Backend: Hash password,     │
│ Create/verify in PostgreSQL │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Return: user data + JWT     │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ AuthContext stores       │
│ user, token, loading     │
│ setAuthToken() → api.js  │
└──────────────────────────┘
```

## AuthContext Setup

The `context/AuthContext.js` manages authentication state:

```javascript
const { user, token, loading, error, login, register, logout } = useAuth();

// Use in components:
const handleLogin = async () => {
    try {
        const user = await login(email, password);
        setAuthToken(token); // Store token in api.js
        // Navigate to dashboard automatically via RootNavigator
    } catch (e) {
        // Show error to user
    }
};
```

## Using Authenticated Endpoints

### Patient Dashboard

```javascript
import { getAuthenticatedHistory, getAuthenticatedLatest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PatientDashboard = () => {
    const { user, token } = useAuth();
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        if (user?.id) {
            // Fetch authenticated patient data
            getAuthenticatedLatest(user.id)
                .then(data => setPredictions([data]))
                .catch(e => console.error(e));
        }
    }, [user?.id]);

    return (
        <View>
            <Text>Patient: {user?.name}</Text>
            <Text>Email: {user?.email}</Text>
            {/* Display predictions */}
        </View>
    );
};
```

### Caretaker Dashboard

```javascript
import { linkPatient, getLinkedPatient, getAuthenticatedHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CaretakerDashboard = () => {
    const { user, token } = useAuth();
    const [linkedPatient, setLinkedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);

    // Link to a patient
    const handleLinkPatient = async (patientEmail) => {
        try {
            const result = await linkPatient(user.id, patientEmail);
            setLinkedPatient(result.patient);
        } catch (e) {
            console.error('Failed to link patient:', e);
        }
    };

    // Get linked patient info
    useEffect(() => {
        if (user?.id) {
            getLinkedPatient(user.id)
                .then(data => setLinkedPatient(data.patient))
                .catch(() => setLinkedPatient(null)); // No linked patient yet
        }
    }, [user?.id]);

    // Get patient's prediction history
    useEffect(() => {
        if (linkedPatient?.id) {
            getAuthenticatedHistory(linkedPatient.id)
                .then(data => setPatientHistory(data))
                .catch(e => console.error(e));
        }
    }, [linkedPatient?.id]);

    return (
        <View>
            <Text>Caretaker: {user?.name}</Text>
            {linkedPatient ? (
                <View>
                    <Text>Linked Patient: {linkedPatient.name}</Text>
                    {/* Display patient's predictions */}
                </View>
            ) : (
                <TextInput
                    placeholder="Enter patient email to link"
                    onChangeText={(email) => {
                        if (email.includes('@')) {
                            handleLinkPatient(email);
                        }
                    }}
                />
            )}
        </View>
    );
};
```

## Making Predictions

### For Logged-In Users

```javascript
import { predict } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PredictionScreen = () => {
    const { user } = useAuth();

    const handlePredict = async (features) => {
        try {
            const result = await predict(
                features,                    // Feature array from audio
                user?.name || 'Anonymous',   // Patient name
                user?.id || null             // Patient ID
            );

            console.log('Prediction:', result);
            // result.status: 'normal' | 'mild' | 'attack'
            // result.confidence: 0-100
        } catch (e) {
            console.error('Prediction failed:', e);
        }
    };

    return (
        <TouchableOpacity onPress={() => handlePredict([...])}>
            <Text>Get Prediction</Text>
        </TouchableOpacity>
    );
};
```

### For Anonymous Users (Testing)

```javascript
// Works without login - uses patient_name instead of patient_id
const result = await predict(features, 'Test Patient');
```

## User Roles & Navigation

### RootNavigator Routing

Based on `user` state from AuthContext:

```
Not Logged In → Auth Screens (Login/Register)
     ↓
Logged In (Patient) → PatientDashboard, PatientMonitoring, PatientHistory
     ↓
Logged In (Caretaker) → CaretakerDashboard, CaretakerHistory
```

Check `navigation/RootNavigator.js` for current routing setup.

## Password Hashing Flow

```
Frontend:                Backend:
[User enters                └─→ POST /auth/register
 "myPassword"]                  ├─ Hash with bcrypt
                                ├─ Store hash in PostgreSQL
                                └─ Return JWT token

[User enters login]        └─→ POST /auth/login
                               ├─ Fetch user from DB
                               ├─ bcrypt.checkpw()
                               ├─ Match? Yes → Return token
                               └─ No → Return 401 error
```

**Important:** Never send raw passwords over unsecured connections. Always use HTTPS in production.

## Model Integration Flow

```
Frontend:                Backend:
[Patient provides      
 breathing audio]  └─→ Extract Features
                       └─→ POST /predict
                           ├─ Load model.h5 (first time)
                           ├─ Forward features through neural net
                           ├─ Get [p_normal, p_mild, p_attack]
                           ├─ argmax() → status
                           ├─ Store in predictions table
                           └─ Return status + confidence

[Show result on
 dashboard] ←───────── {
                         "status": "normal",
                         "confidence": 95.3,
                         "patient_id": 1,
                         "timestamp": "2026-03-05..."
                       }
```

### Prediction Response

```javascript
{
  "id": 123,                              // Prediction ID
  "patient_id": 1,                        // Linked patient
  "patient_name": "Priya Rohan",          // Patient name
  "status": "normal",                     // normal|mild|attack
  "confidence": 95.3,                     // 0-100 percentage
  "raw_probabilities": [0.953, 0.04, 0.007], // All class probabilities
  "timestamp": "2026-03-05T10:30:45..."  // When prediction was made
}
```

## Error Handling

```javascript
const { login, error } = useAuth();

// Handle auth errors
try {
    await login(email, password);
} catch (e) {
    // Common errors:
    // "Invalid email or password" → 401 (wrong credentials)
    // "An account with this email already exists" → 409 (duplicate)
    // "API error 500" → Backend error
    console.error(e.message);
}
```

## Token Management

### Storing Token

```javascript
// Automatically done in LoginScreen/RegisterScreen:
const { token } = await loginUser(email, password);
setAuthToken(token); // Stores in api.js _authToken

// Verify token is set:
import { getAuthToken } from '../services/api';
console.log(getAuthToken()); // Should return JWT string
```

### Using Token in Requests

```javascript
// Automatically added by api.js apiFetch():
headers['Authorization'] = `Bearer ${_authToken}`;

// Example request:
// GET /api/patient-history/1
// Headers: {
//   'Content-Type': 'application/json',
//   'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLC...'
// }
```

### Clearing Token on Logout

```javascript
const { logout } = useAuth();

const handleLogout = () => {
    logout();
    setAuthToken(null); // Clear API token
    // Navigate to Auth screens (automatic via RootNavigator)
};
```

## Component Examples

### LoginScreen Integration

```javascript
// screens/LoginScreen.js already implemented with:
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../services/api';

const handleLogin = async () => {
    const user = await login(email.trim(), password);
    setAuthToken(useAuth().token); // Sync token
    // RootNavigator automatically navigates to dashboard
};
```

### PatientDashboard Integration

```javascript
// screens/PatientDashboard.js should use:
import { getAuthenticatedLatest, predict } from '../services/api';

useEffect(() => {
    // Fetch latest prediction for logged-in patient
    getAuthenticatedLatest(user.id)
        .then(data => setLatestPrediction(data))
        .catch(e => console.error(e));
}, [user?.id]);
```

### CaretakerDashboard Integration

```javascript
// screens/CaretakerDashboard.js should use:
import { getLinkedPatient, getAuthenticatedHistory } from '../services/api';

useEffect(() => {
    // Get linked patient
    getLinkedPatient(user.id)
        .then(data => {
            setLinkedPatient(data.patient);
            // Then get their history
            return getAuthenticatedHistory(data.patient.id);
        })
        .then(history => setPatientHistory(history))
        .catch(e => console.error(e));
}, [user?.id]);
```

## Testing with curl (Backend Testing)

```bash
# 1. Register patient
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "patient@test.com",
    "password": "test123",
    "role": "patient"
  }' | jq '.token' > token.txt

TOKEN=$(cat token.txt | tr -d '"')

# 2. Get authenticated data with token
curl -X GET http://localhost:5000/api/patient-history/1 \
  -H "Authorization: Bearer $TOKEN"

# 3. Verify token works
echo "Token: $TOKEN"
```

## Troubleshooting

### Token Not Persisting Across Screens
- Ensure `setAuthToken(token)` is called after login
- Check token is stored in `api.js` global `_authToken`
- Verify token is included in Authorization header

### "Unauthorized" on Authenticated Endpoints
- Token may be expired or invalid
- Re-login to get fresh token
- Check JWT_SECRET_KEY matches between app.py and .env

### "No linked patient found"
- Caretaker must call `/api/auth/link-patient` first
- Patient email must be exact match
- Verify patient exists in database

### Model predictions always return "unknown"
- Check `asthma_wheeze_model.h5` file exists
- Verify TensorFlow is installed: `pip install tensorflow`
- Check feature vector length matches model input
- Model will use mock predictions as fallback

### CORS Errors
- Backend CORS is configured for all origins (`*`)
- Check API_BASE_URL in frontend matches Flask app URL
- Ensure backend is running before frontend

## Production Considerations

1. **HTTPS Only** - Use SSL/TLS certificates
2. **Token Expiration** - Set `JWT_ACCESS_TOKEN_EXPIRES`
3. **Refresh Tokens** - Implement token refresh mechanism
4. **Secure Storage** - Use secure token storage (e.g., encrypted AsyncStorage)
5. **Rate Limiting** - Add login attempt limits
6. **CORS Policy** - Restrict to specific domains
7. **Password Policy** - Enforce strong passwords
8. **Session Timeout** - Auto-logout after inactivity

## Resources

- [LOGIN_AND_MODEL_SETUP.md](./LOGIN_AND_MODEL_SETUP.md) - Backend configuration
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - PostgreSQL setup
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Flask JWT Guide](https://flask-jwt-extended.readthedocs.io/)