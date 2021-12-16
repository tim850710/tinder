import React from "react";
import StackNavigator from "./StackNavigator";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
import { Logs } from "expo";
Logs.enableExpoCliLogging();
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
