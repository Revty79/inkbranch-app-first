import { Clock } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenShell } from "../components/ScreenShell";
import { useReaderRun } from "../state/ReaderRunContext";
import { colors } from "../theme/colors";

export function RunHistoryScreen() {
  const { runHistory, stories } = useReaderRun();

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Run History</Text>
        {runHistory.length === 0 ? <Text style={styles.empty}>No runs yet.</Text> : null}

        <View style={styles.list}>
          {runHistory.map((run) => {
            const story = stories.find((candidate) => candidate.id === run.bookId);

            return (
              <View key={run.id} style={styles.item}>
                <View style={styles.iconWrap}>
                  <Clock color={colors.surface} size={18} strokeWidth={2.1} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.itemTitle}>{story?.title ?? run.bookId}</Text>
                  <Text style={styles.meta}>
                    Chapter {run.currentChapter} · {run.selectedChoiceIds.length} choices · {new Date(run.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })}
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
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900"
  },
  empty: {
    color: colors.mutedInk,
    fontSize: 15
  },
  list: {
    gap: 10
  },
  item: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blueInk
  },
  copy: {
    flex: 1,
    gap: 4
  },
  itemTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800"
  },
  meta: {
    color: colors.mutedInk,
    fontSize: 13
  }
});
