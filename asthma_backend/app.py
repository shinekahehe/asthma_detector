import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), 'routes', '.env')
load_dotenv(dotenv_path)

from database.db import init_db
from routes.patient_routes import patient_bp
from routes.auth_routes import auth_bp

app = Flask(__name__)

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # tokens don't expire during development
jwt = JWTManager(app)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow all origins so Expo Web (localhost:8081), physical devices, and
# emulators can all reach the API without CORS errors.
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# ── Blueprints ────────────────────────────────────────────────────────────────
app.register_blueprint(patient_bp, url_prefix='/api')
app.register_blueprint(auth_bp,    url_prefix='/api/auth')

# ── Init DB ───────────────────────────────────────────────────────────────────
with app.app_context():
    try:
        init_db()
    except Exception as e:
        print(f"[app] WARNING: Could not initialise DB: {e}")
        print("[app] Make sure PostgreSQL is running and DATABASE_URL is correct in routes/.env")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"[app] Starting Asthma Predictor API on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
