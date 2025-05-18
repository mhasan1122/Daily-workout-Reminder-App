import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import AuthProvider from "./contexts/AuthContext";
import TaskProvider from "./contexts/TaskContext";
import { initNotifications } from "./utils/notificationService";

import "../global.css";

export default function RootLayout() {
  // Initialize notifications when the app starts
  useEffect(() => {
    const initApp = async () => {
      try {
        // Only try to initialize notifications for iOS in Expo Go
        // For Android, full notification support requires a dev build
        if (Platform.OS === 'android') {
          console.log('Full notification support requires a development build on Android');
        }
        await initNotifications();
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };
    
    initApp();
  }, []);

  return (
    <AuthProvider>
      <TaskProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f59e0b",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </TaskProvider>
    </AuthProvider>
  );
}
