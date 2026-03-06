# AsthmaCare AI - React Native Expo App

A frontend-only React Native application built with Expo SDK 55 for monitoring asthma health. This app provides two distinct user modes: **Patient** and **Caretaker**, with intuitive dashboards, health monitoring interfaces, and comprehensive history tracking.

## Features

### 🏥 Patient Mode
- **Dashboard**: Real-time health status display with device connection status
- **Monitoring Screen**: Animated waveform visualization and timer for health monitoring sessions
- **Health History**: Complete log of past readings with severity levels and confidence percentages

### 👨‍⚕️ Caretaker Mode
- **Patient Overview**: Monitor linked patient's current status
- **Alert Management**: View alerts and notifications
- **Alert History**: Comprehensive history of all patient alerts

## Project Structure

```
ASTHMA_PREDICTOR/
├── App.js                          # Main entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── components/                     # Reusable UI components
│   ├── StatusBadge.js             # Device connection status badge
│   ├── AlertCard.js               # Alert notification card
│   ├── LogCard.js                 # Health log entry card
│   ├── Common.js                  # Generic Card and SafeAreaView
│   └── index.js                   # Component exports
├── screens/                        # Screen components
│   ├── ModeSelection.js           # Mode selection screen
│   ├── PatientDashboard.js        # Patient main dashboard
│   ├── PatientMonitoring.js       # Health monitoring interface
│   ├── PatientHistory.js          # Patient health history
│   ├── CaretakerDashboard.js      # Caretaker overview
│   ├── CaretakerHistory.js        # Alert history
│   └── index.js                   # Screen exports
├── navigation/                     # Navigation configuration
│   ├── RootNavigator.js           # Navigation structure
│   └── index.js                   # Navigation exports
└── constants/                      # App constants
    ├── colors.js                  # Color palette and shadows
    └── mockData.js                # Mock data for screens
```

## Color Palette

- **Primary**: `#1E3A8A` (Blue)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Danger**: `#EF4444` (Red)
- **Background**: `#F9FAFB` (Light Gray)

## Navigation Structure

```
RootStack
├── ModeSelection
├── PatientStack (Stack Navigator)
│   ├── PatientTabs (Bottom Tab Navigator)
│   │   ├── PatientDashboard
│   │   └── PatientHistory
│   └── PatientMonitoring
└── CaretakerStack (Stack Navigator)
    └── CaretakerTabs (Bottom Tab Navigator)
        ├── CaretakerDashboard
        └── CaretakerHistory
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Navigate to the project directory:
```bash
cd ASTHMA_PREDICTOR
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Update the Expo SDK (if not already on SDK 55):
```bash
npm install expo@latest
```

### Running the App

#### Using Expo CLI (Recommended)
```bash
npx expo start
```

Then choose:
- **i** for iOS simulator
- **a** for Android emulator
- **w** for web browser
- Scan QR code with Expo Go app for physical device

#### Using npm scripts
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Component Documentation

### StatusBadge
Displays device connection status with color coding.
```jsx
<StatusBadge status="connected" />
```
Available statuses: `connected`, `disconnected`, `connecting`

### AlertCard
Shows alert information with severity level.
```jsx
<AlertCard
  title="Attack Suspected"
  message="High abnormality detected"
  severity="high"
  timestamp="Today at 2:30 PM"
/>
```
Severity levels: `high`, `medium`, `low`

### LogCard
Displays health log entry with date, time, severity, and confidence.
```jsx
<LogCard
  date="Mar 1, 2026"
  time="2:30 PM"
  severity="normal"
  confidence={98}
/>
```
Severity levels: `normal`, `mild`, `attack`

### Card
Generic container for content with optional elevation.
```jsx
<Card elevated={true}>
  {/* Content */}
</Card>
```

## Mock Data

The app uses mock data stored in `constants/mockData.js`:

- **PATIENT_HISTORY**: 6 mock health readings
- **CARETAKER_ALERTS**: 4 mock alert entries
- **PATIENT_DATA**: Current patient status
- **CARETAKER_DATA**: Caretaker view information

## Technology Stack

- **React Native** - Cross-platform mobile development
- **Expo SDK 55** - Managed React Native framework
- **React Navigation 7** - Navigation library
  - Stack Navigator
  - Bottom Tab Navigator
- **Reanimated 3** - Animations (for waveform)
- **Vector Icons** - Icon library (via emoji text)

## Design Features

- ✅ Modern card-based layout
- ✅ Smooth navigation transitions
- ✅ Shadow elevation for depth
- ✅ Consistent typography
- ✅ Responsive spacing
- ✅ Color-coded status indicators
- ✅ Animated waveform visualization
- ✅ Clean, production-grade UI

## Screens Overview

### Mode Selection
- Two large buttons for Patient and Caretaker modes
- Clear visual distinction with icons and descriptions
- Navigates to respective stack navigators

### Patient Dashboard
- Greeting with patient name
- Device connection status badge
- Large circular status indicator (animated)
- Current health status with confidence percentage
- Last checked timestamp
- Begin/Stop Monitoring buttons
- Quick link to view history

### Patient Monitoring
- Animated waveform placeholder
- Real-time timer display
- Active monitoring status indicator
- Device connectivity status
- Stop Monitoring button
- Real-time status updates

### Patient History
- Scrollable list of health readings
- Date, time, severity badge, and confidence % per entry
- Color-coded severity indicators
- Quick reference for past data

### Caretaker Dashboard
- Linked patient information
- Current patient status badge
- Latest alert summary
- Quick statistics (readings today, active alerts)
- View full history button

### Caretaker History
- Scrollable list of all alerts
- Alert severity, timestamp, and details
- Patient name for reference
- Alert message and action indicators

## Future Enhancements

While this version is frontend-only, potential future additions include:

- Real BLE device integration
- Cloud data synchronization
- Machine learning predictions
- Push notifications
- Data persistence
- User authentication
- Real-time data streaming
- Advanced analytics

## Notes

- All data is currently mock data stored locally
- No backend integration or API calls
- No data persistence between sessions
- Monitoring timer is mock-only for demonstration
- All health readings are simulated for UI demonstration

## License

This project is part of AsthmaCare AI initiative.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
