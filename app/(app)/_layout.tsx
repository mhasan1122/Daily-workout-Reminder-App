import { Redirect, Stack } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Tasks",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Create Task",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Task",
          headerShown: true,
          presentation: "modal",
        }}
      />
    </Stack>
  );
} 