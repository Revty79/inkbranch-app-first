import { StatusBar } from "expo-status-bar";
import { ReaderRunProvider } from "./src/state/ReaderRunContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <ReaderRunProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </ReaderRunProvider>
  );
}
