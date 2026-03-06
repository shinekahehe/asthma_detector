# Quick Start Guide - AsthmaCare AI

## 🚀 Get Up and Running in 2 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm start
```

### Step 3: Choose Your Platform
- **iOS**: Press `i`
- **Android**: Press `a`
- **Web**: Press `w`
- **Physical Device**: Scan QR code with Expo Go app

### Step 4: Explore the App

#### Patient Mode:
1. Tap "Patient Mode" on the welcome screen
2. View your health dashboard with status indicator
3. Tap "Begin Monitoring" to see the monitoring screen with timer
4. Use the Dashboard and History tabs to navigate

#### Caretaker Mode:
1. Press the back button or restart to the welcome screen
2. Tap "Caretaker Mode"
3. View the patient overview with status and alerts
4. Check the History tab for detailed alert logs

## 📱 App Structure at a Glance

```
Welcome Screen → Mode Selection
    ↓
    ├─→ PATIENT MODE
    │   ├─ Dashboard (Health status, device connection)
    │   ├─ Monitoring (Animated waveform, timer)
    │   └─ History (Past readings)
    │
    └─→ CARETAKER MODE
        ├─ Dashboard (Patient overview, alerts)
        └─ History (Alert logs)
```

## 🎨 UI Features

- ✅ Modern card-based design
- ✅ Color-coded status badges (Green = Normal, Yellow = Mild, Red = Attack)
- ✅ Animated waveform on monitoring screen
- ✅ Responsive bottom tab navigation
- ✅ Clean typography and spacing
- ✅ Professional shadow effects

## 📝 Key Components Used

| Component | Purpose |
|-----------|---------|
| `StatusBadge` | Device connection status (Connected/Disconnected) |
| `AlertCard` | Alert notifications with severity |
| `LogCard` | Health reading entries |
| `Card` | Generic container with elevation |

## 🔧 Customization

### Colors
Edit `constants/colors.js` to change the color scheme

### Mock Data
Edit `constants/mockData.js` to update patient readings and alerts

### Screen Styling
Edit individual screen files in `/screens` folder

## ✨ What's Included

- ✅ Complete UI implementation
- ✅ Full navigation structure (Stack + Bottom Tabs)
- ✅ Mock data for both modes
- ✅ Reusable components
- ✅ Professional color palette
- ✅ Responsive design
- ✅ Production-ready code

## ⚠️ Important Notes

- This is a **frontend-only** demo
- No backend connections
- No data persistence
- Mock data resets on app restart
- Monitoring timer is for UI demonstration only

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Navigation not working
- Ensure you're using React Navigation v7
- Check that all screens are imported correctly
- Verify package.json has all required dependencies

### Missing components
- All components are in `/components` folder
- Import them using `import { ComponentName } from '../components'`

## 📞 Need Help?

Refer to:
- `SETUP_GUIDE.md` - Detailed setup instructions
- Component files have inline comments
- Mock data structure in `constants/mockData.js`

---

**Happy coding!** 🎉
