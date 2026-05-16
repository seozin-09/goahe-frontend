import { Colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export function PaperCard({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.paper,
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.paperBorder,
  },
});
