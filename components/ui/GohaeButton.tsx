import { Colors } from "@/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

export function GohaeButton({
  label,
  onPress,
  variant = "white",
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: "white" | "black";
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === "black" ? styles.black : styles.white,
        style,
      ]}
    >
      <Text style={[styles.text, variant === "black" ? styles.textWhite : styles.textBlack]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
  },
  white: {
    backgroundColor: Colors.white,
    borderColor: Colors.black,
  },
  black: {
    backgroundColor: Colors.black,
    borderColor: Colors.white,
  },
  text: { fontSize: 16, fontWeight: "700" },
  textBlack: { color: Colors.black },
  textWhite: { color: Colors.white },
});
