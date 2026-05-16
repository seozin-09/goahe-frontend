// app/(tabs)/save.tsx
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

const STORAGE_KEY = "gohae_confessions";

// ✅ 단계 임시저장 키들 (STEP2 추가)
const STEP1_KEY = "gohae_step1_text";
const STEP2_KEY = "gohae_step2_text";
const STEP3_KEY = "gohae_step3_text";
const STEP4_KEY = "gohae_step4_text";

export default function SaveScreen() {
  const params = useLocalSearchParams();
  const [mergedText, setMergedText] = useState("");

  // ✅ next2에서 넘어온 text (지금 단계 텍스트 or 이미 합쳐진 텍스트)
  const passedText = useMemo(() => {
    const t = params?.text;
    return typeof t === "string" ? t : "";
  }, [params]);

  // ✅ next2(또는 다른 화면)에서 title까지 같이 넘겨주면 여기서 받음 (없으면 빈값)
  const passedTitle = useMemo(() => {
    const t = (params as any)?.title;
    return typeof t === "string" ? t : "";
  }, [params]);

  useEffect(() => {
    (async () => {
      try {
        const incoming = passedText.trim();

        // ✅ 들어온 텍스트는 STEP4에 저장해두고(기존 흐름 유지)
        // (앞 단계는 STEP1~3에 저장돼있을 수 있음)
        if (incoming) {
          await AsyncStorage.setItem(STEP4_KEY, incoming);
        }

        const s1 = (await AsyncStorage.getItem(STEP1_KEY)) ?? "";
        const s2 = (await AsyncStorage.getItem(STEP2_KEY)) ?? "";
        const s3 = (await AsyncStorage.getItem(STEP3_KEY)) ?? "";
        const s4 = (await AsyncStorage.getItem(STEP4_KEY)) ?? "";

        // ✅ 1~4단계 전부 합치기
        const combined = [s1, s2, s3, s4]
          .map((v) => v.trim())
          .filter(Boolean)
          .join("\n\n");

        setMergedText(combined || incoming || "");
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

    // ✅ save_name으로 text + title 같이 넘김
    // (save_name에서 title 입력/수정 후 최종 저장하면 기록에 title이 남음)
    router.push({
      pathname: "/save_name",
      params: {
        text: mergedText.trim(),
        title: passedTitle || "", // ✅ 전달
      },
    });
  };

  const onPressSkip = async () => {
    // ✅ STEP2까지 같이 정리
    await AsyncStorage.removeItem(STEP1_KEY);
    await AsyncStorage.removeItem(STEP2_KEY);
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