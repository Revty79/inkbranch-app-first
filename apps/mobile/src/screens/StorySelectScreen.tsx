import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RefreshCw } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActionButton } from "../components/ActionButton";
import { ScreenShell } from "../components/ScreenShell";
import { StoryCard } from "../components/StoryCard";
import { useReaderRun } from "../state/ReaderRunContext";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "../navigation/types";

type StorySelectScreenProps = NativeStackScreenProps<RootStackParamList, "StorySelect">;

export function StorySelectScreen({ navigation }: StorySelectScreenProps) {
  const { stories, loading, error, refreshStories, startStory } = useReaderRun();

  async function handleStart(storyId: string) {
    await startStory(storyId);
    navigation.navigate("Reader");
  }

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Stories</Text>
          <ActionButton label="Refresh" icon={RefreshCw} variant="secondary" disabled={loading} onPress={refreshStories} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading && !stories.length ? <Text style={styles.status}>Loading stories...</Text> : null}

        <View style={styles.list}>
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} disabled={loading} onPress={handleStart} />
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 28
  },
  header: {
    gap: 12
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900"
  },
  list: {
    gap: 12
  },
  status: {
    color: colors.mutedInk,
    fontSize: 15
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20
  }
});
