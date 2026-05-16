import { Colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

export function GohaeBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.root}>
      {/* concentric circles */}
      <View style={styles.c1} />
      <View style={styles.c2} />
      <View style={styles.c3} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },

  c1: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  c2: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  c3: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  content: {
    width: "100%",
    padding: 16,
  },
});
