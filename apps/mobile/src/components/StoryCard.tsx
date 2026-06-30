import type { StorySummary } from "../services/inkbranchApi";
import { BookOpen, Play } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface StoryCardProps {
  story: StorySummary;
  disabled?: boolean;
  onPress: (storyId: string) => void;
}

export function StoryCard({ story, disabled = false, onPress }: StoryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => onPress(story.id)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.iconWrap}>
        <BookOpen color={colors.surface} size={20} strokeWidth={2.1} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.author}>{story.author}</Text>
        <Text style={styles.logline}>{story.logline}</Text>
      </View>
      <Play color={colors.cedar} size={18} fill={colors.cedar} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  pressed: {
    backgroundColor: colors.surfaceMuted
  },
  disabled: {
    opacity: 0.6
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.moss
  },
  copy: {
    flex: 1,
    gap: 3
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "800"
  },
  author: {
    color: colors.cedar,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  logline: {
    color: colors.mutedInk,
    fontSize: 13,
    lineHeight: 18
  }
});
