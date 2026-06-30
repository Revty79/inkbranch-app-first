import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { BookOpen, Send } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { ChoiceButton } from "../components/ChoiceButton";
import { ScreenShell } from "../components/ScreenShell";
import { useReaderRun } from "../state/ReaderRunContext";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";

type ReaderScreenProps = NativeStackScreenProps<RootStackParamList, "Reader">;

export function ReaderScreen({ navigation }: ReaderScreenProps) {
  const { currentRun, currentScene, selectedStory, loading, error, choose, chooseCustomChoice } = useReaderRun();
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

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.storyTitle}>{selectedStory?.title ?? "Inkbranch Story"}</Text>
          <Text style={styles.chapterTitle}>{currentScene.chapterTitle}</Text>
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

        <View style={styles.choices}>
          {currentScene.choices.map((choice) => (
            <ChoiceButton key={choice.id} choice={choice} disabled={loading} onPress={choose} />
          ))}
        </View>

        <View style={styles.customChoice}>
          <TextInput
            editable={!loading}
            multiline
            onChangeText={setCustomChoiceText}
            placeholder="Write what happens next"
            placeholderTextColor={colors.mutedInk}
            style={styles.customChoiceInput}
            textAlignVertical="top"
            value={customChoiceText}
          />
          <ActionButton
            label="Send"
            icon={Send}
            disabled={loading || !customChoiceText.trim()}
            onPress={handleCustomChoice}
          />
        </View>
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
