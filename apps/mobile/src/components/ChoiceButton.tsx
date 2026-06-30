import type { Choice } from "@inkbranch/types";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface ChoiceButtonProps {
  choice: Choice;
  disabled?: boolean;
  onPress: (choiceId: string) => void;
}

export function ChoiceButton({ choice, disabled = false, onPress }: ChoiceButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => onPress(choice.id)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.textWrap}>
        <Text style={styles.label}>{choice.label}</Text>
        <Text style={styles.intent}>{choice.intent}</Text>
      </View>
      <ChevronRight color={colors.moss} size={20} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  pressed: {
    backgroundColor: colors.surfaceMuted
  },
  disabled: {
    opacity: 0.55
  },
  textWrap: {
    flex: 1,
    gap: 4
  },
  label: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  intent: {
    color: colors.mutedInk,
    fontSize: 13,
    lineHeight: 18
  }
});
