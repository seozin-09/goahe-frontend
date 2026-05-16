import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Confession = {
  id: string;
  title?: string; // ✅ 저장 이름
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "gohae_confessions";

// 네가 쓰던 임시 저장 키들(정리용)
const STEP1_KEY = "gohae_step1_text";
const STEP3_KEY = "gohae_step3_text";
const STEP4_KEY = "gohae_step4_text";

export default function SaveNameScreen() {
  const params = useLocalSearchParams();

  const mergedText = useMemo(() => {
    const t = params?.text;
    return typeof t === "string" ? t : "";
  }, [params]);

  const [title, setTitle] = useState("");

  const safeParseArray = (raw: string | null) => {
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as Confession[]) : [];
    } catch {
      return [];
    }
  };

  const canConfirm = title.trim().length > 0 && mergedText.trim().length > 0;

  const onConfirm = async () => {
    if (!canConfirm) return;

    const newItem: Confession = {
      id: Date.now().toString(),
      title: title.trim(),
      text: mergedText.trim(),
      createdAt: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = safeParseArray(existing);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newItem, ...parsed])
    );

    // ✅ 임시 저장 키들 정리
    await AsyncStorage.removeItem(STEP1_KEY);
    await AsyncStorage.removeItem(STEP3_KEY);
    await AsyncStorage.removeItem(STEP4_KEY);

    router.replace("/records");
  };

  return (
    <View style={styles.outer}>
      <ImageBackground
        source={require("../../assets/images/bg_v2.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <StatusBar style="light" translucent />

        <SafeAreaView style={styles.safe} edges={["top"]}>
          {/* ===== 헤더 (마이페이지랑 동일 톤) ===== */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Image
                source={require("../../assets/images/arrow_back.png")}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Text style={styles.headerTitle}>저장</Text>
          </View>

          {/* ===== 가운데 카드 ===== */}
          <View style={styles.center}>
            <View style={styles.card}>
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
                  무슨 이름으로 저장할까요?{"\n"}
                  저장할 이름을 입력해 주세요!
                </Text>

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="입력해주세요..."
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  style={styles.input}
                />

                <Pressable
                  onPress={onConfirm}
                  disabled={!canConfirm}
                  style={({ pressed }) => [
                    styles.btn,
                    pressed && styles.btnPressed,
                    !canConfirm && { opacity: 0.55 },
                  ]}
                >
                  {({ pressed }) => (
                    <Text style={[styles.btnText, pressed && styles.btnTextPressed]}>
                      확인
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#6F665D", // ✅ my.tsx와 동일(남는 틈 색)
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safe: { flex: 1 },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "TitleFont",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  card: {
    width: "86%",
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

  input: {
    marginTop: 10,
    height: 36,
    borderWidth: 1.2,
    borderColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    fontFamily: "BodyFont",
    fontSize: 14,
    color: "#111",
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  btn: {
    marginTop: 14,
    alignSelf: "center",
    width: 140,
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