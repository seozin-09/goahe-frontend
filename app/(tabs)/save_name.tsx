// app/save_name.tsx (또는 기존 경로 그대로)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo } from "react";
import { ImageBackground, View } from "react-native";

type Confession = {
  id: string;
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "gohae_confessions";

// 임시 저장 키들 정리용
const STEP1_KEY = "gohae_step1_text";
const STEP2_KEY = "gohae_step2_text";
const STEP3_KEY = "gohae_step3_text";
const STEP4_KEY = "gohae_step4_text";

function safeParseArray(raw: string | null): Confession[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Confession[]) : [];
  } catch {
    return [];
  }
}

export default function SaveNameScreen() {
  const params = useLocalSearchParams();

  const mergedText = useMemo(() => {
    const t = params?.text;
    return typeof t === "string" ? t : "";
  }, [params]);

  useEffect(() => {
    (async () => {
      const text = mergedText.trim();
      if (!text) {
        router.replace("/records");
        return;
      }

      const newItem: Confession = {
        id: Date.now().toString(),
        text,
        createdAt: new Date().toISOString(),
      };

      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = safeParseArray(existing);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newItem, ...parsed]));

      // 임시 저장 키들 정리
      await Promise.all([
        AsyncStorage.removeItem(STEP1_KEY),
        AsyncStorage.removeItem(STEP2_KEY),
        AsyncStorage.removeItem(STEP3_KEY),
        AsyncStorage.removeItem(STEP4_KEY),
      ]);

      router.replace("/records");
    })();
  }, [mergedText]);

  // 화면은 잠깐 스쳐가는 용도(로딩/전환). 배경 유지.
  return (
    <View style={{ flex: 1, backgroundColor: "#6F665D" }}>
      <ImageBackground
        source={require("../../assets/images/bg_v2.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <StatusBar style="light" translucent />
      </ImageBackground>
    </View>
  );
}