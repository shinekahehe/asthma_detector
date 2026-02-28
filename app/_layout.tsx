import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="recording" />
        <Stack.Screen name="processing" />
        <Stack.Screen name="results" />
        <Stack.Screen name="history" />
        <Stack.Screen name="insights" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="report/[id]" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
