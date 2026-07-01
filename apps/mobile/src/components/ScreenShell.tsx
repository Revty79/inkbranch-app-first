import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReaderRun } from "../state/ReaderRunContext";
import { colors } from "../theme/colors";

export function ScreenShell({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <EngineStatusBanner />
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

function EngineStatusBanner() {
  const { engineMode, backendWarning } = useReaderRun();

  if (!__DEV__) {
    return null;
  }

  const isFallback = engineMode === "fallback";
  const label =
    engineMode === "backend"
      ? "Backend connected"
      : isFallback
        ? "Local fallback mode"
        : "Backend status unknown";

  return (
    <View style={[styles.statusBanner, isFallback ? styles.fallbackBanner : styles.backendBanner]}>
      <Text style={styles.statusLabel}>{label}</Text>
      {backendWarning ? (
        <Text style={styles.statusDetail}>
          Failed {backendWarning.apiUrl}
          {backendWarning.route}; using fallback: {backendWarning.usingFallback ? "yes" : "no"}. {backendWarning.message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18
  },
  statusBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 3
  },
  backendBanner: {
    backgroundColor: "#E8EFE5",
    borderColor: "#9DB58F"
  },
  fallbackBanner: {
    backgroundColor: "#F7E4BC",
    borderColor: colors.amber
  },
  statusLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  statusDetail: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17
  }
});
