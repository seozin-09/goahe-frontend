// app/signup.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/bg_v2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View
        pointerEvents="none"
        style={[styles.bottomFill, { height: insets.bottom }]}
      />

      {/* 상단 뒤로가기 */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.replace("/")} style={styles.backRow}>
          <Image
            source={require("../assets/images/arrow_back.png")}
            style={styles.backIcon}
          />
          <Text style={styles.backText}>뒤로가기</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.center}>
          <Text style={styles.subtitle}>고백하여 해결하는 성스러운 일</Text>
          <Text style={styles.title}>고해성사</Text>

          {/* 카드 */}
          <View style={styles.cardWrap}>
            <ImageBackground
              source={require("../assets/images/paper_v2.png")}
              style={styles.paperBg}
              imageStyle={styles.paperImg}
              resizeMode="stretch"
            >
              <View style={styles.cardInner}>
                {/* 아이디 */}
                <Text style={styles.label}>아이디</Text>
                <View style={styles.row}>
                  <TextInput style={[styles.input, { flex: 1 }]} />
                  <Pressable style={styles.dupBtn}>
                    <Text style={styles.dupText}>중복확인</Text>
                  </Pressable>
                </View>

                {/* 비밀번호 */}
                <Text style={[styles.label, { marginTop: 14 }]}>비밀번호</Text>
                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1, paddingRight: 40 }]}
                    secureTextEntry={!showPw}
                  />
                  <Pressable
                    style={styles.eyeBtn}
                    onPress={() => setShowPw((v) => !v)}
                  >
                    <Ionicons
                      name={showPw ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#222"
                    />
                  </Pressable>
                </View>

                {/* 비밀번호 확인 */}
                <Text style={[styles.label, { marginTop: 14 }]}>
                  비밀번호 새 확인
                </Text>
                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1, paddingRight: 40 }]}
                    secureTextEntry={!showPw2}
                  />
                  <Pressable
                    style={styles.eyeBtn}
                    onPress={() => setShowPw2((v) => !v)}
                  >
                    <Ionicons
                      name={showPw2 ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#222"
                    />
                  </Pressable>
                </View>

                {/* 이름 */}
                <Text style={[styles.label, { marginTop: 14 }]}>이름</Text>
                <TextInput style={styles.input} />

                {/* 생년월일 */}
                <Text style={[styles.label, { marginTop: 14 }]}>생년월일</Text>
                <View style={styles.birthRow}>
                  <TextInput style={styles.birthInput} placeholder="년(4자)" />
                  <View style={styles.birthSelect}>
                    <Text style={styles.birthText}>월</Text>
                    <Ionicons name="chevron-down" size={16} color="#222" />
                  </View>
                  <TextInput style={styles.birthInput} placeholder="일" />
                </View>

                {/* 이메일 */}
                <Text style={[styles.label, { marginTop: 14 }]}>이메일</Text>
                <View style={styles.emailRow}>
                  <TextInput style={styles.emailInput} />
                  <View style={styles.emailSuffix}>
                    <Text style={styles.emailSuffixText}>@gmail.com</Text>
                  </View>
                </View>

                {/* 🔥 가입하기 위치 조정 */}
                <Pressable style={styles.submitBtn}>
                  <Text style={styles.submitText}>가입하기</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#6F675F" },
  bottomFill: { position: "absolute", left: 0, right: 0, bottom: 0 },

  topBar: { paddingHorizontal: 18 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  backIcon: { width: 22, height: 22 },
  backText: { color: "#fff", fontFamily: "BodyFont", fontSize: 14 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  subtitle: {
    fontFamily: "BodyFont",
    fontSize: 14,
    color: "#EAEAEA",
    marginBottom: 6,
  },
  title: {
    fontFamily: "TitleFont",
    fontSize: 34,
    color: "#E2B24C",
    marginBottom: 16,
  },

  cardWrap: {
    width: 330,
    height: 620,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  paperBg: { flex: 1 },
  paperImg: { borderRadius: 22 },

  cardInner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  label: {
    fontFamily: "BodyFont",
    fontSize: 13,
    color: "#111",
    marginBottom: 6,
  },

  row: { flexDirection: "row", alignItems: "center", gap: 10 },

  input: {
    height: 38,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  dupBtn: {
    height: 34,
    paddingHorizontal: 12,
    backgroundColor: "#E2B24C",
    borderRadius: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  dupText: { fontSize: 12, fontFamily: "BodyFont" },

  eyeBtn: {
    position: "absolute",
    right: 10,
    height: 38,
    justifyContent: "center",
  },

  birthRow: { flexDirection: "row", gap: 10 },
  birthInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  birthSelect: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  birthText: { fontFamily: "BodyFont" },

  emailRow: { flexDirection: "row" },
  emailInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "#333",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  emailSuffix: {
    height: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
  },
  emailSuffixText: { fontFamily: "BodyFont", fontSize: 13 },

  /* 🔥 여기 수정 */
  submitBtn: {
    marginTop: 30,   // 🔥 auto 제거, 숫자로 조정
    height: 48,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  submitText: { fontFamily: "TitleFont", fontSize: 18 },
});