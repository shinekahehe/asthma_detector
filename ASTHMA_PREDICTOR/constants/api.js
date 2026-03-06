// Detect environment: Expo Web runs at localhost, native uses LAN IP
const isWeb =
    typeof window !== 'undefined' &&
    (window.location?.hostname === 'localhost' ||
        window.location?.hostname === '127.0.0.1');

// ── Change the LAN_IP to match your machine (shown in `npx expo start` output)
const LAN_IP = '10.78.149.64';

export const API_BASE_URL = isWeb
    ? 'http://localhost:5000/api'        // Expo Web — same machine, no CORS issue
    : `http://${LAN_IP}:5000/api`;       // Physical device / emulator on LAN

// Default patient name used as fallback when not logged in
export const DEFAULT_PATIENT_NAME = 'Priya';
