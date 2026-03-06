import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../services/api';

// ── Screens ──────────────────────────────────────────────────────────────────
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ModeSelection } from '../screens/ModeSelection';
import { PatientDashboard } from '../screens/PatientDashboard';
import { PatientMonitoring } from '../screens/PatientMonitoring';
import { PatientHistory } from '../screens/PatientHistory';
import { CaretakerDashboard } from '../screens/CaretakerDashboard';
import { CaretakerHistory } from '../screens/CaretakerHistory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ─────────────────────────────────────────────────────────────────────────────
// Auth Stack — Login / Register
// ─────────────────────────────────────────────────────────────────────────────
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// ─────────────────────────────────────────────────────────────────────────────
// Patient Tabs
// ─────────────────────────────────────────────────────────────────────────────
const PatientTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray400,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.gray200,
        paddingTop: 8,
        paddingBottom: 8,
        height: 60,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 4 },
    }}
  >
    <Tab.Screen
      name="PatientDashboard"
      component={PatientDashboard}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
      }}
    />
    {/* FIX: was 'PatientHistoryTab' — now matches navigate('PatientHistory') */}
    <Tab.Screen
      name="PatientHistory"
      component={PatientHistory}
      options={{
        tabBarLabel: 'History',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📈</Text>,
      }}
    />
  </Tab.Navigator>
);

// ─────────────────────────────────────────────────────────────────────────────
// Patient Stack (Tabs + Monitoring as push screen)
// ─────────────────────────────────────────────────────────────────────────────
const PatientStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.white,
        borderBottomColor: COLORS.gray200,
        borderBottomWidth: 1,
      },
      headerTitleStyle: { fontSize: 16, fontWeight: '700', color: COLORS.gray900 },
      headerTintColor: COLORS.primary,
    }}
  >
    <Stack.Screen
      name="PatientTabs"
      component={PatientTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PatientMonitoring"
      component={PatientMonitoring}
      options={{ title: 'Monitoring', headerBackTitle: 'Back' }}
    />
  </Stack.Navigator>
);

// ─────────────────────────────────────────────────────────────────────────────
// Caretaker Tabs
// ─────────────────────────────────────────────────────────────────────────────
const CaretakerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray400,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.gray200,
        paddingTop: 8,
        paddingBottom: 8,
        height: 60,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 4 },
    }}
  >
    <Tab.Screen
      name="CaretakerDashboard"
      component={CaretakerDashboard}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏥</Text>,
      }}
    />
    {/* FIX: was 'CaretakerHistoryTab' — now matches navigate('CaretakerHistory') */}
    <Tab.Screen
      name="CaretakerHistory"
      component={CaretakerHistory}
      options={{
        tabBarLabel: 'Alerts',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔔</Text>,
      }}
    />
  </Tab.Navigator>
);

const CaretakerStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.white,
        borderBottomColor: COLORS.gray200,
        borderBottomWidth: 1,
      },
      headerTitleStyle: { fontSize: 16, fontWeight: '700', color: COLORS.gray900 },
      headerTintColor: COLORS.primary,
    }}
  >
    <Stack.Screen
      name="CaretakerTabs"
      component={CaretakerTabNavigator}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// ─────────────────────────────────────────────────────────────────────────────
// Root Navigator — auth-gated
// ─────────────────────────────────────────────────────────────────────────────
export const RootNavigator = () => {
  const { user, token } = useAuth();

  // Keep api module token in sync whenever auth state changes
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <NavigationContainer>
      {user ? (
        // ── Logged-in: route to the correct flow based on role ───────────────
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user.role === 'patient' ? (
            <Stack.Screen name="PatientStack" component={PatientStackNavigator} />
          ) : (
            <Stack.Screen name="CaretakerStack" component={CaretakerStackNavigator} />
          )}
          {/* ModeSelection kept as an optional manual switch */}
          <Stack.Screen name="ModeSelection" component={ModeSelection} />
        </Stack.Navigator>
      ) : (
        // ── Not logged in: show Auth screens ─────────────────────────────────
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
