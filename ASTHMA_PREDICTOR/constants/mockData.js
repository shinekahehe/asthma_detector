export const PATIENT_HISTORY = [
  {
    id: '1',
    date: 'Mar 1, 2026',
    time: '2:30 PM',
    severity: 'normal',
    confidence: 98,
  },
  {
    id: '2',
    date: 'Mar 1, 2026',
    time: '1:15 PM',
    severity: 'mild',
    confidence: 72,
  },
  {
    id: '3',
    date: 'Feb 28, 2026',
    time: '11:45 AM',
    severity: 'normal',
    confidence: 96,
  },
  {
    id: '4',
    date: 'Feb 28, 2026',
    time: '8:20 AM',
    severity: 'attack',
    confidence: 89,
  },
  {
    id: '5',
    date: 'Feb 27, 2026',
    time: '3:00 PM',
    severity: 'normal',
    confidence: 95,
  },
  {
    id: '6',
    date: 'Feb 27, 2026',
    time: '10:30 AM',
    severity: 'mild',
    confidence: 68,
  },
];

export const CARETAKER_ALERTS = [
  {
    id: '1',
    patientName: 'Priya',
    timestamp: 'Today at 2:30 PM',
    status: 'Attack Suspected',
    severity: 'high',
    message: 'High abnormality detected. Confidence: 89%',
  },
  {
    id: '2',
    patientName: 'Priya',
    timestamp: 'Today at 1:15 PM',
    status: 'Mild Abnormality',
    severity: 'medium',
    message: 'Mild deviation detected. Confidence: 72%',
  },
  {
    id: '3',
    patientName: 'Priya',
    timestamp: 'Yesterday at 8:20 AM',
    status: 'Attack Suspected',
    severity: 'high',
    message: 'High abnormality detected. Confidence: 89%',
  },
  {
    id: '4',
    patientName: 'Priya',
    timestamp: 'Feb 27 at 3:00 PM',
    status: 'Normal',
    severity: 'low',
    message: 'Patient readings are normal',
  },
];

export const PATIENT_DATA = {
  name: 'Priya',
  deviceStatus: 'connected',
  lastChecked: '2 minutes ago',
  currentStatus: 'normal',
  confidence: 98,
};

export const CARETAKER_DATA = {
  linkedPatient: 'Priya',
  currentStatus: 'normal',
  lastAlert: 'Today at 2:30 PM - Attack Suspected',
};
