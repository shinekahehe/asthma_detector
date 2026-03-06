from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from database.db import get_db

auth_bp = Blueprint('auth', __name__)


# ─── POST /api/auth/register ─────────────────────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    body = request.get_json(force=True, silent=True) or {}
    name     = body.get('name', '').strip()
    email    = body.get('email', '').strip().lower()
    password = body.get('password', '')
    role     = body.get('role', 'patient')  # 'patient' | 'caretaker'

    if not all([name, email, password]):
        return jsonify({'error': 'name, email and password are required'}), 400

    if role not in ('patient', 'caretaker'):
        return jsonify({'error': "role must be 'patient' or 'caretaker'"}), 400

    # Hash the password
    pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO users (name, email, password_hash, role)
               VALUES (%s, %s, %s, %s)
               RETURNING id, name, email, role""",
            (name, email, pw_hash, role)
        )
        user = dict(cur.fetchone())
        conn.commit()

        token = create_access_token(
            identity={'id': user['id'], 'name': user['name'], 'role': user['role']}
        )
        return jsonify({'user': user, 'token': token}), 201

    except Exception as e:
        conn.rollback()
        if 'unique' in str(e).lower():
            return jsonify({'error': 'An account with this email already exists'}), 409
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ─── POST /api/auth/login ─────────────────────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
def login():
    body = request.get_json(force=True, silent=True) or {}
    email    = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not all([email, password]):
        return jsonify({'error': 'email and password are required'}), 400

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        row = cur.fetchone()

        if not row:
            return jsonify({'error': 'Invalid email or password'}), 401

        user = dict(row)
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401

        token = create_access_token(
            identity={'id': user['id'], 'name': user['name'], 'role': user['role']}
        )
        return jsonify({
            'user': {
                'id':    user['id'],
                'name':  user['name'],
                'email': user['email'],
                'role':  user['role'],
            },
            'token': token,
        }), 200

    finally:
        cur.close()
        conn.close()


# ─── GET /api/auth/me  (optional — useful for token refresh scenarios) ────────
@auth_bp.route('/me', methods=['GET'])
def me():
    """
    Clients can POST their token in the body to verify it.
    Lightweight liveness check for the auth system.
    """
    return jsonify({'status': 'auth service running'}), 200


# ─── POST /api/auth/link-patient ─────────────────────────────────────────────
@auth_bp.route('/link-patient', methods=['POST'])
def link_patient():
    """
    Only for caretakers to link themselves to a patient via patient email.
    Caretaker provides their own user ID and the patient's email.
    """
    body = request.get_json(force=True, silent=True) or {}
    caretaker_id = body.get('caretaker_id')
    patient_email = body.get('patient_email', '').strip().lower()

    if not caretaker_id or not patient_email:
        return jsonify({'error': 'caretaker_id and patient_email are required'}), 400

    conn = get_db()
    cur = conn.cursor()
    try:
        # Verify caretaker exists and is a caretaker
        cur.execute("SELECT id, role FROM users WHERE id = %s", (caretaker_id,))
        caretaker = cur.fetchone()
        if not caretaker:
            return jsonify({'error': 'Caretaker not found'}), 404
        if caretaker['role'] != 'caretaker':
            return jsonify({'error': 'User is not a caretaker'}), 400

        # Find patient by email
        cur.execute("SELECT id, role, name FROM users WHERE email = %s", (patient_email,))
        patient = cur.fetchone()
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        if patient['role'] != 'patient':
            return jsonify({'error': 'User is not a patient'}), 400

        # Link caretaker to patient
        cur.execute(
            "UPDATE users SET linked_patient_id = %s WHERE id = %s",
            (patient['id'], caretaker_id)
        )
        conn.commit()

        return jsonify({
            'message': f'Caretaker linked to patient {patient["name"]}',
            'caretaker_id': caretaker_id,
            'patient_id': patient['id'],
            'patient_name': patient['name'],
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ─── GET /api/auth/linked-patient ────────────────────────────────────────────
@auth_bp.route('/linked-patient/<int:caretaker_id>', methods=['GET'])
def get_linked_patient(caretaker_id):
    """
    Retrieve the patient linked to a caretaker.
    """
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT linked_patient_id FROM users 
            WHERE id = %s AND role = 'caretaker'
        """, (caretaker_id,))
        row = cur.fetchone()
        
        if not row or not row['linked_patient_id']:
            return jsonify({'error': 'No linked patient found'}), 404

        # Get patient details
        cur.execute("SELECT id, name, email FROM users WHERE id = %s", 
                   (row['linked_patient_id'],))
        patient = dict(cur.fetchone())
        return jsonify({'patient': patient}), 200

    finally:
        cur.close()
        conn.close()
