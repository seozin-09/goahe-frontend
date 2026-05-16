import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar from "./CustomTabBar";

export default function TabBarOverlay() {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {/* ✅ 하단 시스템 영역까지 더 크게 덮기 */}
      <View
        pointerEvents="none"
        style={[
          styles.bottomFill,
          { height: insets.bottom + 40 }, // 40은 여유값
        ]}
      />

      <View
        pointerEvents="box-none"
        style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <CustomTabBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },
});