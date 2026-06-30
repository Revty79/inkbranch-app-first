import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookOpen, History, Play } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { ScreenShell } from "../components/ScreenShell";
import { useReaderRun } from "../state/ReaderRunContext";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { currentRun, selectedStory, runHistory } = useReaderRun();

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>Inkbranch</Text>
          <Text style={styles.title}>Choose the path. Keep the canon.</Text>
        </View>

        {currentRun && selectedStory ? (
          <View style={styles.currentRun}>
            <Text style={styles.sectionLabel}>Current Run</Text>
            <Text style={styles.currentTitle}>{selectedStory.title}</Text>
            <Text style={styles.currentMeta}>
              Chapter {currentRun.currentChapter} · {currentRun.selectedChoiceIds.length} choices made
            </Text>
            <ActionButton label="Continue" icon={Play} onPress={() => navigation.navigate("Reader")} />
          </View>
        ) : null}

        <View style={styles.actions}>
          <ActionButton label="Stories" icon={BookOpen} onPress={() => navigation.navigate("StorySelect")} />
          <ActionButton
            label={`History ${runHistory.length ? `(${runHistory.length})` : ""}`}
            icon={History}
            variant="secondary"
            onPress={() => navigation.navigate("RunHistory")}
          />
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: 24,
    paddingBottom: 28
  },
  titleBlock: {
    gap: 8,
    paddingTop: 18
  },
  kicker: {
    color: colors.cedar,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900"
  },
  currentRun: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 10
  },
  sectionLabel: {
    color: colors.moss,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  currentTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "900"
  },
  currentMeta: {
    color: colors.mutedInk,
    fontSize: 14,
    marginBottom: 4
  },
  actions: {
    gap: 12
  }
});
