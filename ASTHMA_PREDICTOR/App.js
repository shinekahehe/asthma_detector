import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from './navigation';
import { AuthProvider } from './context/AuthContext';
import { COLORS } from './constants/colors';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  React.useEffect(() => {
    // Hide splash screen when app is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </>
  );
}
