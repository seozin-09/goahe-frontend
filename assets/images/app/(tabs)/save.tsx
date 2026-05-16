import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Confession = {
  id: string;
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "gohae_confessions";
const STEP1_KEY = "gohae_step1_text";
const STEP3_KEY = "gohae_step3_text";
const STEP4_KEY = "gohae_step4_text";

export default function SaveScreen() {
  const params = useLocalSearchParams();
  const [mergedText, setMergedText] = useState("");

  const passedText = useMemo(() => {
    const t = params?.text;
    return typeof t === "string" ? t : "";
  }, [params]);

  useEffect(() => {
    (async () => {
      try {
        if (passedText.trim()) {
          await AsyncStorage.setItem(STEP4_KEY, passedText.trim());
        }

        const s1 = (await AsyncStorage.getItem(STEP1_KEY)) ?? "";
        const s3 = (await AsyncStorage.getItem(STEP3_KEY)) ?? "";
        const s4 = (await AsyncStorage.getItem(STEP4_KEY)) ?? "";

        const combined = [s1, s3, s4]
          .map((v) => v.trim())
          .filter(Boolean)
          .join("\n\n");

        setMergedText(combined || passedText.trim() || "");
      } catch {
        setMergedText(passedText.trim() || "");
      }
    })();
  }, [passedText]);

  const canSave = useMemo(() => mergedText.trim().length > 0, [mergedText]);

  // ✅ (tabs) 빼고 실제 경로로 이동
  const goRecords = () => {
    router.replace("/records");
  };

  const onPressSave = () => {
    if (!canSave) return;

    // ✅ (tabs) 빼고 /save_name 으로
    router.push({
      pathname: "/save_name",
      params: { text: mergedText.trim() },
    });
  };

  const onPressSkip = async () => {
    await AsyncStorage.removeItem(STEP1_KEY);
    await AsyncStorage.removeItem(STEP3_KEY);
    await AsyncStorage.removeItem(STEP4_KEY);
    goRecords();
  };

  return (
    <View style={styles.outer}>
      <ImageBackground
        source={require("../../assets/images/bg_v2.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <StatusBar style="light" translucent />

        <Pressable style={styles.dim} onPress={() => router.back()} />

        <View style={styles.modalWrap} pointerEvents="auto">
          <Image
            source={require("../../assets/images/paper_v2.png")}
            style={StyleSheet.absoluteFillObject}
            resizeMode="stretch"
          />

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>5.저장</Text>

              <Image
                source={require("../../assets/images/book.png")}
                style={styles.book}
                resizeMode="contain"
              />
            </View>

            <View style={styles.line} />

            <Text style={styles.desc}>
              오늘의 고백을 저장할까요?{"\n"}
              저장한다면 기록에서 다시 볼 수 있습니다!
            </Text>

            <View style={styles.btnRow}>
              <Pressable
                onPress={onPressSave}
                disabled={!canSave}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.btnPressed,
                  !canSave && { opacity: 0.55 },
                ]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnText, pressed && styles.btnTextPressed]}>
                    저장하기
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={onPressSkip}
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnText, pressed && styles.btnTextPressed]}>
                    저장하지 않기
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#6F665D" },
  bg: { flex: 1, width: "100%", height: "100%" },

  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  modalWrap: {
    position: "absolute",
    left: 16,
    right: 47,
    top: 210,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontFamily: "TitleFont", fontSize: 24, color: "#111" },
  book: { width: 25, height: 25 },

  line: {
    marginTop: 10,
    height: 1.2,
    backgroundColor: "rgba(0,0,0,0.75)",
  },

  desc: {
    marginTop: 10,
    fontFamily: "BodyFont",
    fontSize: 15,
    color: "#111",
    lineHeight: 21,
  },

  btnRow: { flexDirection: "row", gap: 14, marginTop: 14 },

  btn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  btnText: { fontFamily: "BodyFont", fontSize: 15, color: "#111" },
  btnPressed: { backgroundColor: "#222", borderColor: "#222" },
  btnTextPressed: { color: "#fff" },
});