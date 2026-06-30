import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

interface ActionButtonProps {
  label: string;
  icon: ComponentType<LucideProps>;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  onPress: () => void;
}

export function ActionButton({ label, icon: Icon, disabled = false, variant = "primary", onPress }: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <Icon color={isPrimary ? colors.surface : colors.moss} size={18} strokeWidth={2.2} />
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 46,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  primary: {
    backgroundColor: colors.moss
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  pressed: {
    opacity: 0.82
  },
  disabled: {
    opacity: 0.55
  },
  label: {
    fontSize: 15,
    fontWeight: "800"
  },
  primaryLabel: {
    color: colors.surface
  },
  secondaryLabel: {
    color: colors.ink
  }
});
