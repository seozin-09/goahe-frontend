import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const LINE_LEFT = -5;
const LINE_RIGHT = -5;
const LINE_TOP = 8;
const LINE_THICKNESS = 1;

// (선택) 이동 중 텍스트 유실 방지용
const DRAFT_KEY = "gohae_draft_text";

export default function Next2Screen() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  const canSubmit = useMemo(() => text.trim().length > 0, [text]);

  const onSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // (선택) 화면 이동 중 텍스트 보존
    try {
      await AsyncStorage.setItem(DRAFT_KEY, trimmed);
    } catch {}

    // ✅ save.tsx가 app/(tabs)/save.tsx 이므로 이 경로로 가야 함
    router.push({
      pathname: "/(tabs)/save",
      params: { text: trimmed },
    });
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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.header}>
              <Pressable onPress={() => router.back()} style={styles.backBtn}>
                <Image
                  source={require("../../assets/images/arrow_back.png")}
                  style={styles.backIcon}
                />
              </Pressable>
              <Text style={styles.headerTitle}>작성</Text>
            </View>

            <View style={styles.body}>
              <View style={styles.paperShell}>
                <ImageBackground
                  source={require("../../assets/images/paper_v2.png")}
                  style={styles.paper}
                  resizeMode="stretch"
                >
                  <Text style={styles.title}>고해성사</Text>

                  <View style={styles.lineWrapper}>
                    <View
                      style={[
                        styles.line,
                        {
                          left: LINE_LEFT,
                          right: LINE_RIGHT,
                          top: LINE_TOP,
                          height: LINE_THICKNESS,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.section}>4.오늘의 나의 다짐!</Text>

                  <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="작성하기..."
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    multiline
                    style={styles.input}
                    textAlignVertical="top"
                  />

                  <View style={styles.btnRow}>
                    <Pressable
                      style={styles.btnWhite}
                      onPress={() => setText("")}
                    >
                      <Text style={styles.btnText}>초기화</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.btnGray, !canSubmit && styles.btnDisabled]}
                      disabled={!canSubmit}
                      onPress={onSubmit}
                    >
                      <Text style={styles.btnText}>작성완료</Text>
                    </Pressable>
                  </View>

                  <View style={{ height: insets.bottom + 6 }} />
                </ImageBackground>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#6F665D" },
  bg: { flex: 1 },
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
  backIcon: { width: 22, height: 22, tintColor: "#ffffff" },
  headerTitle: { fontSize: 20, color: "#ffffff", fontFamily: "TitleFont" },

  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 34,
    paddingHorizontal: 18,
  },

  paperShell: {
    width: "100%",
    maxWidth: 340,
    height: 520,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },
  paper: {
    flex: 1,
    paddingTop: 26,
    paddingHorizontal: 18,
    paddingBottom: 18,
    position: "relative",
  },

  title: { fontFamily: "TitleFont", fontSize: 26, color: "#111" },

  lineWrapper: { position: "relative", height: 20 },
  line: { position: "absolute", backgroundColor: "rgba(0,0,0,0.8)" },

  section: {
    fontFamily: "BodyFont",
    fontSize: 16,
    color: "#111",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    fontFamily: "BodyFont",
    fontSize: 16,
    color: "#111",
    padding: 0,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 14,
  },
  btnWhite: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  btnGray: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(190,190,190,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: "BodyFont", fontSize: 16, color: "#111" },
});