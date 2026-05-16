// app/_layout.tsx
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  const [loaded] = useFonts({
    TitleFont: require("../assets/fonts/TitleFont.ttf"),
    BodyFont: require("../assets/fonts/BodyFont.ttf"),
  });

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" translucent />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        {/* ✅ records/[id] 는 자동으로 라우팅되므로 따로 등록 안 해도 됨 */}
      </Stack>
    </>
  );
}