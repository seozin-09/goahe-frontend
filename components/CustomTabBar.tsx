import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function CustomTabBar({ navigation }: BottomTabBarProps) {
  const go = (name: string) => navigation.navigate(name as never);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Image
        source={require("../assets/images/tabber_bg.png")}
        style={styles.background}
        resizeMode="stretch"
      />

      {/* 기록 */}
      <Pressable onPress={() => go("records")} style={[styles.button, styles.left]}>
        <Image
          source={require("../assets/images/tab_book.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.label}>기록</Text>
      </Pressable>

      {/* 작성 (노란 원 + +아이콘) */}
      <Pressable onPress={() => go("write")} style={[styles.button, styles.center]}>
        <Image
          source={require("../assets/images/plus_circle.png")}
          style={styles.plusCircle}
          resizeMode="contain"
        />
        <Image
          source={require("../assets/images/plus_icon.png")}
          style={styles.plusIcon}
          resizeMode="contain"
        />
      </Pressable>

      {/* 마이페이지 */}
      <Pressable onPress={() => go("my")} style={[styles.button, styles.right]}>
        <Image
          source={require("../assets/images/tab_my.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.label}>마이페이지</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 95,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 95,
    width: "100%",
  },

  button: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  left: {
    left: 50,
    bottom: 10,
    width: 80,
    height: 70,
  },
  right: {
    right: 50,
    bottom: 10,
    width: 80,
    height: 70,
  },

  // 노란 원 위치(원하면 bottom 숫자만 조절)
  center: {
    left: "50%",
    transform: [{ translateX: -36 }],
    bottom: 13,
    width: 72,
    height: 72,
  },

  icon: {
    width: 32,
    height: 32,
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 12,
    color: "#6b645a",
    fontFamily: "BodyFont", // 너 폰트 유지
  },

  plusCircle: {
    width: 72,
    height: 72,
  },
  plusIcon: {
    position: "absolute",
    width: 26,
    height: 26,
  },
});