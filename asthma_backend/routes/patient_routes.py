from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from database.db import get_db
from model.predictor import predict_from_features

patient_bp = Blueprint('patient', __name__)


# ─── POST /api/predict ────────────────────────────────────────────────────────
@patient_bp.route('/predict', methods=['POST'])
def predict():
    body         = request.get_json(force=True, silent=True) or {}
    features     = body.get('features', [])
    patient_name = body.get('patient_name', 'Unknown')
    patient_id   = body.get('patient_id')   # optional — sent when logged in

    if not features:
        return jsonify({'error': 'No features provided'}), 400

    result = predict_from_features(features)

    conn = get_db()
    cur  = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO predictions
                   (patient_id, patient_name, status, confidence, raw_probabilities)
               VALUES (%s, %s, %s, %s, %s)
               RETURNING id, patient_id, patient_name, status, confidence, created_at""",
            (
                patient_id,
                patient_name,
                result['status'],
                result['confidence'],
                json.dumps(result.get('raw_probabilities', [])),
            )
        )
        row = dict(cur.fetchone())
        conn.commit()
        row['timestamp'] = row.pop('created_at').isoformat()
        return jsonify(row), 201
    finally:
        cur.close()
        conn.close()


# ─── GET /api/history ─────────────────────────────────────────────────────────
@patient_bp.route('/history', methods=['GET'])
def history():
    patient_name = request.args.get('patient_name', '')
    patient_id   = request.args.get('patient_id')
    limit        = int(request.args.get('limit', 20))

    conn = get_db()
    cur  = conn.cursor()
    try:
        if patient_id:
            cur.execute(
                """SELECT id, patient_id, patient_name, status, confidence,
                          created_at AS timestamp
                   FROM predictions WHERE patient_id = %s
                   ORDER BY created_at DESC LIMIT %s""",
                (patient_id, limit)
            )
        else:
            cur.execute(
                """SELECT id, patient_id, patient_name, status, confidence,
                          created_at AS timestamp
                   FROM predictions WHERE patient_name = %s
                   ORDER BY created_at DESC LIMIT %s""",
                (patient_name, limit)
            )
        rows = [dict(r) for r in cur.fetchall()]
        for r in rows:
            r['timestamp'] = r['timestamp'].isoformat()
        return jsonify(rows), 200
    finally:
        cur.close()
        conn.close()


# ─── GET /api/latest ──────────────────────────────────────────────────────────
@patient_bp.route('/latest', methods=['GET'])
def latest():
    patient_name = request.args.get('patient_name', '')
    patient_id   = request.args.get('patient_id')

    conn = get_db()
    cur  = conn.cursor()
    try:
        if patient_id:
            cur.execute(
                """SELECT id, patient_id, patient_name, status, confidence,
                          created_at AS timestamp
                   FROM predictions WHERE patient_id = %s
                   ORDER BY created_at DESC LIMIT 1""",
                (patient_id,)
            )
        else:
            cur.execute(
                """SELECT id, patient_id, patient_name, status, confidence,
                          created_at AS timestamp
                   FROM predictions WHERE patient_name = %s
                   ORDER BY created_at DESC LIMIT 1""",
                (patient_name,)
            )
        row = cur.fetchone()
        if not row:
            return jsonify({'error': 'No data found'}), 404
        r = dict(row)
        r['timestamp'] = r['timestamp'].isoformat()
        return jsonify(r), 200
    finally:
        cur.close()
        conn.close()


# ─── GET /api/health ──────────────────────────────────────────────────────────
@patient_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'db': 'postgresql'}), 200


# ─── GET /api/patient-history (requires auth) ──────────────────────────────────
@patient_bp.route('/patient-history/<int:patient_id>', methods=['GET'])
@jwt_required()
def patient_history(patient_id):
    """
    Get prediction history for a specific patient.
    Patients can view their own data.
    Caretakers can view their linked patient's data.
    """
    identity = get_jwt_identity()
    user_id = identity.get('id')
    user_role = identity.get('role')
    limit = int(request.args.get('limit', 20))

    conn = get_db()
    cur = conn.cursor()
    try:
        # Authorization check
        if user_role == 'patient':
            if user_id != patient_id:
                return jsonify({'error': 'Unauthorized access'}), 403
        elif user_role == 'caretaker':
            cur.execute(
                "SELECT linked_patient_id FROM users WHERE id = %s",
                (user_id,)
            )
            row = cur.fetchone()
            if not row or row['linked_patient_id'] != patient_id:
                return jsonify({'error': 'Unauthorized access'}), 403
        else:
            return jsonify({'error': 'Invalid role'}), 400

        # Get history
        cur.execute("""
            SELECT id, patient_id, patient_name, status, confidence,
                   created_at AS timestamp
            FROM predictions WHERE patient_id = %s
            ORDER BY created_at DESC LIMIT %s
        """, (patient_id, limit))
        rows = [dict(r) for r in cur.fetchall()]
        for r in rows:
            r['timestamp'] = r['timestamp'].isoformat()
        return jsonify(rows), 200

    finally:
        cur.close()
        conn.close()


# ─── GET /api/patient-latest (requires auth) ───────────────────────────────────
@patient_bp.route('/patient-latest/<int:patient_id>', methods=['GET'])
@jwt_required()
def patient_latest(patient_id):
    """
    Get latest prediction for a specific patient.
    Authorization: same as patient_history.
    """
    identity = get_jwt_identity()
    user_id = identity.get('id')
    user_role = identity.get('role')

    conn = get_db()
    cur = conn.cursor()
    try:
        # Authorization check
        if user_role == 'patient':
            if user_id != patient_id:
                return jsonify({'error': 'Unauthorized access'}), 403
        elif user_role == 'caretaker':
            cur.execute(
                "SELECT linked_patient_id FROM users WHERE id = %s",
                (user_id,)
            )
            row = cur.fetchone()
            if not row or row['linked_patient_id'] != patient_id:
                return jsonify({'error': 'Unauthorized access'}), 403
        else:
            return jsonify({'error': 'Invalid role'}), 400

        # Get latest prediction
        cur.execute("""
            SELECT id, patient_id, patient_name, status, confidence,
                   created_at AS timestamp
            FROM predictions WHERE patient_id = %s
            ORDER BY created_at DESC LIMIT 1
        """, (patient_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({'error': 'No data found'}), 404
        r = dict(row)
        r['timestamp'] = r['timestamp'].isoformat()
        return jsonify(r), 200

    finally:
        cur.close()
        conn.close()
