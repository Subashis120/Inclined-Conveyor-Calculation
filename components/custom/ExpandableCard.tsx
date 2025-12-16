import { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Animated, {
  Layout,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

export default function ExpandableCard({ title, value }) {
  const [open, setOpen] = useState(false);

  return (
    <Animated.View
      style={styles.card}
      layout={Layout.springify()}
      entering={FadeIn}
      exiting={FadeOut}
    >
      {/* Header (always visible) */}
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <View style={styles.row}>
          <Text style={styles.keyText}>{title}</Text>
          <Text style={styles.valueText}>
            {value === null || value === undefined ? "—" : String(value)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded section */}
      {open && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text style={styles.detailText}>
            {value === null || value === undefined
              ? "—"
              : typeof value === "object"
              ? JSON.stringify(value, null, 2)
              : String(value)}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  keyText: {
    fontSize: 16,
    fontWeight: "600",
    width: "50%",        // fixed column width
  },

  valueText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
    width: "40%",        // fixed column width
  },

  detailText: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.8,
  },
});
