import { API_BASE_URL, DEFAULT_PATIENT_NAME } from '../constants/api';

// ─── Shared token store (set by AuthContext after login) ──────────────────────
let _authToken = null;
export const setAuthToken = (token) => { _authToken = token; };
export const getAuthToken = () => _authToken;

// ─── Helper ───────────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    const headers = { 'Content-Type': 'application/json' };
    if (_authToken) headers['Authorization'] = `Bearer ${_authToken}`;

    const res = await fetch(url, { headers, ...options });

    if (!res.ok) {
        let msg = `API error ${res.status}`;
        try {
            const body = await res.json();
            msg = body.error || msg;
        } catch (_) { }
        throw new Error(msg);
    }
    return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function registerUser(name, email, password, role) {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
    });
}

// ─── Prediction ───────────────────────────────────────────────────────────────
export async function predict(features, patientName = DEFAULT_PATIENT_NAME, patientId = null) {
    return apiFetch('/predict', {
        method: 'POST',
        body: JSON.stringify({
            features,
            patient_name: patientName,
            ...(patientId ? { patient_id: patientId } : {}),
        }),
    });
}

// ─── History ──────────────────────────────────────────────────────────────────
export async function getHistory(patientName = DEFAULT_PATIENT_NAME, limit = 20, patientId = null) {
    const params = new URLSearchParams({ limit });
    if (patientId) params.set('patient_id', patientId);
    else params.set('patient_name', patientName);
    return apiFetch(`/history?${params}`);
}

// ─── Latest ───────────────────────────────────────────────────────────────────
export async function getLatest(patientName = DEFAULT_PATIENT_NAME, patientId = null) {
    const params = new URLSearchParams();
    if (patientId) params.set('patient_id', patientId);
    else params.set('patient_name', patientName);
    return apiFetch(`/latest?${params}`);
}

// ─── Authenticated Patient Data ────────────────────────────────────────────────
/**
 * Get authenticated patient history (requires JWT token)
 * Patients can view their own data
 * Caretakers can view their linked patient's data
 */
export async function getAuthenticatedHistory(patientId, limit = 20) {
    return apiFetch(`/patient-history/${patientId}?limit=${limit}`);
}

/**
 * Get authenticated patient's latest prediction (requires JWT token)
 * Patients can view their own data
 * Caretakers can view their linked patient's data
 */
export async function getAuthenticatedLatest(patientId) {
    return apiFetch(`/patient-latest/${patientId}`);
}

// ─── Caretaker Functions ───────────────────────────────────────────────────────
/**
 * Link a caretaker to a patient using patient email
 */
export async function linkPatient(caretakerId, patientEmail) {
    return apiFetch('/auth/link-patient', {
        method: 'POST',
        body: JSON.stringify({ caretaker_id: caretakerId, patient_email: patientEmail }),
    });
}

/**
 * Get the patient linked to a caretaker
 */
export async function getLinkedPatient(caretakerId) {
    return apiFetch(`/auth/linked-patient/${caretakerId}`);
}

// ─── Health ───────────────────────────────────────────────────────────────────
export async function checkHealth() {
    return apiFetch('/health');
}
