import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { ReaderScreen } from "../screens/ReaderScreen";
import { RunHistoryScreen } from "../screens/RunHistoryScreen";
import { StorySelectScreen } from "../screens/StorySelectScreen";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.moss,
    text: colors.ink,
    border: colors.border
  }
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inkbranch" }} />
        <Stack.Screen name="StorySelect" component={StorySelectScreen} options={{ title: "Stories" }} />
        <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: "Reader" }} />
        <Stack.Screen name="RunHistory" component={RunHistoryScreen} options={{ title: "Run History" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
