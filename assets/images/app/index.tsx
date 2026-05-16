// app/index.tsx
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/bg_v2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View style={styles.center}>
        <Text style={styles.subtitle}>고백하여 해결하는 성스러운 일</Text>
        <Text style={styles.title}>고해성사</Text>

        <Image
          source={require("../assets/images/candle.png")}
          style={styles.candle}
          resizeMode="contain"
        />

        {/* 로그인 */}
        <Pressable
          onPress={() => router.push("/login")}
          style={({ pressed }) => [
            styles.btn,
            pressed && styles.btnPressed,
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.btnText,
                pressed && styles.btnTextPressed,
              ]}
            >
              로그인
            </Text>
          )}
        </Pressable>

        {/* 회원가입 */}
        <Pressable
          onPress={() => router.push("/signup")}
          style={({ pressed }) => [
            styles.btn,
            { marginTop: 14 },
            pressed && styles.btnPressed,
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.btnText,
                pressed && styles.btnTextPressed,
              ]}
            >
              회원가입
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#6F665D" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  subtitle: {
    fontFamily: "BodyFont",
    fontSize: 14,
    color: "#EAEAEA",
    marginBottom: 6,
  },

  title: {
    fontFamily: "TitleFont",
    fontSize: 36,
    color: "#E2B24C",
    marginBottom: 18,
  },

  candle: {
    width: 120,
    height: 170,
    marginBottom: 30,
  },

  btn: {
    width: 240,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F2EFEA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  // 🔥 눌렀을 때 배경
  btnPressed: {
    backgroundColor: "#000",
  },

  btnText: {
    fontFamily: "TitleFont",
    fontSize: 18,
    color: "#111",
  },

  // 🔥 눌렀을 때 글자색
  btnTextPressed: {
    color: "#fff",
  },
});