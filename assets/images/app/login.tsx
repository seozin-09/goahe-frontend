// app/login.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const EDGE = "#6F675F";
  const R = 12;

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);

  // ✅ 로그인 버튼 눌렀을 때만 이동
  const onLogin = () => {
    if (!id.trim() || !pw.trim()) {
      Alert.alert("로그인", "아이디와 비밀번호를 입력해줘.");
      return;
    }

    router.replace("/(tabs)/write");
  };

  return (
    <View style={[styles.root, { backgroundColor: EDGE }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/bg_v2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View
        pointerEvents="none"
        style={[styles.bottomFill, { height: insets.bottom, backgroundColor: EDGE }]}
      />

      {/* 🔥 뒤로가기 → 2번 화면(index) */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.replace("/")} style={styles.backRow}>
          <Image
            source={require("../assets/images/arrow_back.png")}
            style={styles.backIcon}
          />
          <Text style={styles.backText}>뒤로가기</Text>
        </Pressable>
      </View>

      <View style={[styles.center, { paddingBottom: 70 + insets.bottom }]}>
        <Text style={styles.subtitle}>고백하여 해결하는 성스러운 일</Text>
        <Text style={styles.title}>고해성사</Text>

        <Image
          source={require("../assets/images/candle.png")}
          style={styles.candle}
          resizeMode="contain"
        />

        <View style={styles.cardWrap}>
          <Image
            source={require("../assets/images/paper_v2.png")}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 30 }]}
            resizeMode="stretch"
          />

          <View style={styles.cardInner}>
            <TextInput
              value={id}
              onChangeText={setId}
              placeholder="아이디"
              placeholderTextColor="#A7A7A7"
              style={[styles.input, { borderRadius: R }]}
              autoCapitalize="none"
            />

            <TextInput
              value={pw}
              onChangeText={setPw}
              placeholder="비밀번호"
              placeholderTextColor="#A7A7A7"
              style={[styles.input, { marginTop: 12, borderRadius: R }]}
              secureTextEntry
            />

            <Pressable
              onPress={() => setKeepLogin((v) => !v)}
              style={styles.checkRow}
            >
              <View style={[styles.checkboxWrap, { borderRadius: R / 2 }]}>
                {keepLogin && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.checkText}>로그인 상태 유지</Text>
            </Pressable>

            <Pressable
              onPress={onLogin}
              style={[styles.loginBtn, { borderRadius: R }]}
            >
              <Text style={styles.loginBtnText}>로그인</Text>
            </Pressable>

            <View style={styles.linksRow}>
              <Text style={styles.linkText}>아이디 찾기</Text>
              <Text style={styles.linkDivider}>|</Text>
              <Text style={styles.linkText}>비밀번호 찾기</Text>
              <Text style={styles.linkDivider}>|</Text>
              <Pressable onPress={() => router.push("/signup")}>
                <Text style={styles.linkText}>회원 가입</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bottomFill: { position: "absolute", left: 0, right: 0, bottom: 0 },

  topBar: { paddingHorizontal: 18 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  backIcon: { width: 22, height: 22, resizeMode: "contain" },
  backText: { color: "#FFFFFF", fontFamily: "BodyFont", fontSize: 14 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
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

  candle: { width: 110, height: 160, marginBottom: 18 },

  cardWrap: {
    width: 330,
    height: 260,
    borderRadius: 30,
    overflow: "hidden",
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },

  input: {
    height: 38,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    fontFamily: "BodyFont",
    fontSize: 14,
    color: "#111",
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  checkboxWrap: {
    width: 22,
    height: 22,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: {
    fontSize: 16,
    color: "#111",
    fontWeight: "900",
  },
  checkText: { fontFamily: "BodyFont", fontSize: 13, color: "#111" },

  loginBtn: {
    marginTop: 14,
    height: 46,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    fontFamily: "TitleFont",
    fontSize: 18,
    color: "#111",
  },

  linksRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  linkText: { fontFamily: "BodyFont", fontSize: 12, color: "#6B6B6B" },
  linkDivider: { fontFamily: "BodyFont", fontSize: 12, color: "#8A8A8A" },
});