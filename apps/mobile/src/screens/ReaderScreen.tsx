import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { BookOpen, RotateCcw, Send } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { ChoiceButton } from "../components/ChoiceButton";
import { ScreenShell } from "../components/ScreenShell";
import { useReaderRun } from "../state/ReaderRunContext";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";

type ReaderScreenProps = NativeStackScreenProps<RootStackParamList, "Reader">;

export function ReaderScreen({ navigation }: ReaderScreenProps) {
  const { currentRun, currentScene, selectedStory, loading, error, choose, chooseCustomChoice, restartCurrentRun } =
    useReaderRun();
  const [customChoiceText, setCustomChoiceText] = useState("");

  async function handleCustomChoice() {
    const trimmedChoice = customChoiceText.trim();

    if (!trimmedChoice) {
      return;
    }

    await chooseCustomChoice(trimmedChoice);
    setCustomChoiceText("");
  }

  if (!currentRun || !currentScene) {
    return (
      <ScreenShell>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No active run</Text>
          <ActionButton label="Choose Story" icon={BookOpen} onPress={() => navigation.navigate("StorySelect")} />
        </View>
      </ScreenShell>
    );
  }

  const activeFlags = Object.entries(currentRun.storyState.flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag);
  const canonFacts = currentRun.canonCommits.flatMap((commit) => commit.canonFacts).slice(-5);
  const isCompleted = currentRun.status === "completed";

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.storyTitle}>{selectedStory?.title ?? "Inkbranch Story"}</Text>
          <Text style={styles.chapterTitle}>{currentScene.chapterTitle}</Text>
          <Text style={styles.progressMeta}>
            Turn {currentRun.storyState.turnCount + 1} · {currentScene.storyProgress?.locationName ?? "Saltglass"} ·
            Danger {currentRun.storyState.dangerLevel}
          </Text>
        </View>

        <View style={styles.sceneText}>
          {currentScene.sceneText.split(/\n\n+/).map((paragraph) => (
            <Text key={paragraph} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <Text style={styles.status}>Loading next scene...</Text> : null}

        {isCompleted ? (
          <ActionButton label="Start Over" icon={RotateCcw} disabled={loading} onPress={restartCurrentRun} />
        ) : (
          <>
            <View style={styles.choices}>
              {currentScene.choices.map((choice) => (
                <ChoiceButton key={choice.id} choice={choice} disabled={loading} onPress={choose} />
              ))}
            </View>

            <View style={styles.customChoice}>
              <Text style={styles.customChoiceLabel}>Write your own choice</Text>
              <TextInput
                editable={!loading}
                multiline
                onChangeText={setCustomChoiceText}
                placeholder="Try: hide the letter, ask Orrin, open the seal..."
                placeholderTextColor={colors.mutedInk}
                style={styles.customChoiceInput}
                textAlignVertical="top"
                value={customChoiceText}
              />
              <ActionButton
                label="Submit Choice"
                icon={Send}
                disabled={loading || !customChoiceText.trim()}
                onPress={handleCustomChoice}
              />
            </View>
          </>
        )}

        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>Memory and canon so far</Text>
          <Text style={styles.debugLine}>
            Flags: {activeFlags.length ? activeFlags.join(", ") : "none yet"}
          </Text>
          <Text style={styles.debugLine}>
            Last choice: {currentRun.storyState.lastChoiceResolution?.canonValidity ?? "none"}
          </Text>
          {canonFacts.length ? (
            canonFacts.map((fact) => (
              <Text key={fact} style={styles.debugFact}>
                {fact}
              </Text>
            ))
          ) : (
            <Text style={styles.debugLine}>No committed canon yet.</Text>
          )}
        </View>

        {!isCompleted ? (
          <ActionButton label="Start Over" icon={RotateCcw} variant="secondary" disabled={loading} onPress={restartCurrentRun} />
        ) : null}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 22,
    paddingBottom: 34
  },
  header: {
    gap: 6
  },
  storyTitle: {
    color: colors.cedar,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  chapterTitle: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  progressMeta: {
    color: colors.mutedInk,
    fontSize: 13,
    fontWeight: "700"
  },
  sceneText: {
    gap: 14
  },
  paragraph: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 29
  },
  choices: {
    gap: 10
  },
  customChoice: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    gap: 10
  },
  customChoiceLabel: {
    color: colors.cedar,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  customChoiceInput: {
    minHeight: 86,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  debugPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    gap: 7
  },
  debugTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  debugLine: {
    color: colors.mutedInk,
    fontSize: 13,
    lineHeight: 18
  },
  debugFact: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18
  },
  status: {
    color: colors.mutedInk,
    fontSize: 14
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    gap: 16
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900"
  }
});
