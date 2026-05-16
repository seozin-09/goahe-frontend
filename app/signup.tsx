// app/signup.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const API_BASE_URL = "http://10.0.2.2:3000";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();

  // ✅ 입력값 state
  const [userId, setUserId] = useState(""); // UI상 아이디 (백엔드에는 아직 안 보냄)
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState(""); // UI용 (백엔드에는 아직 안 보냄)
  const [birthY, setBirthY] = useState(""); // UI용
  const [birthD, setBirthD] = useState(""); // UI용
  const [emailLocal, setEmailLocal] = useState("");

  // 비번 보기/숨기기
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // 중복확인 모달 (UI 유지)
  const [dupOpen, setDupOpen] = useState(false);

  // 월 드롭다운 (UI 유지)
  const [monthOpen, setMonthOpen] = useState(false);
  const [month, setMonth] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const monthLabel = useMemo(() => (month ? `${month}월` : "월"), [month]);

  const pickMonth = (m: number) => {
    setMonth(m);
    setMonthOpen(false);
  };

  const buildEmail = () => {
    const local = emailLocal.trim();
    if (!local) return "";
    return `${local}@gmail.com`;
  };

  const onRegister = async () => {
    const email = buildEmail();
    const password = pw.trim();
    const password2 = pw2.trim();

    if (!email) {
      Alert.alert("입력 확인", "이메일 아이디를 입력해줘.");
      return;
    }
    if (!password) {
      Alert.alert("입력 확인", "비밀번호를 입력해줘.");
      return;
    }
    if (password.length < 4) {
      Alert.alert("입력 확인", "비밀번호는 4자 이상으로 해줘.");
      return;
    }
    if (password !== password2) {
      Alert.alert("입력 확인", "비밀번호가 서로 달라.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `회원가입 실패 (HTTP ${res.status})`;
        Alert.alert("회원가입 실패", msg);
        return;
      }

      // ✅ 성공
      Alert.alert("회원가입 성공", "이제 로그인해줘.", [
        {
          text: "확인",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (e: any) {
      Alert.alert("네트워크 오류", e?.message || "요청 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/bg_v2.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={[styles.bottomFill, { height: insets.bottom }]} />

      {/* 상단 뒤로가기 */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.replace("/")} style={styles.backRow}>
          <Image source={require("../assets/images/arrow_back.png")} style={styles.backIcon} />
          <Text style={styles.backText}>뒤로가기</Text>
        </Pressable>
      </View>

      {/* 월 드롭다운 열렸을 때 바깥 누르면 닫기 */}
      {monthOpen && <Pressable style={styles.backdrop} onPress={() => setMonthOpen(false)} />}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
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
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={userId}
                    onChangeText={setUserId}
                    autoCapitalize="none"
                  />
                  <Pressable style={styles.dupBtn} onPress={() => setDupOpen(true)}>
                    <Text style={styles.dupText}>중복확인</Text>
                  </Pressable>
                </View>

                {/* 비밀번호 */}
                <Text style={[styles.label, { marginTop: 14 }]}>비밀번호</Text>
                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1, paddingRight: 44 }]}
                    value={pw}
                    onChangeText={setPw}
                    secureTextEntry={!showPw}
                    autoCapitalize="none"
                  />
                  <Pressable style={styles.eyeBtn} onPress={() => setShowPw((v) => !v)}>
                    <Image
                      source={
                        showPw
                          ? require("../assets/images/eye-on.png")
                          : require("../assets/images/eye-off.png")
                      }
                      style={styles.eyeImg}
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>

                {/* 비밀번호 새 확인 */}
                <Text style={[styles.label, { marginTop: 14 }]}>비밀번호 새 확인</Text>
                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1, paddingRight: 44 }]}
                    value={pw2}
                    onChangeText={setPw2}
                    secureTextEntry={!showPw2}
                    autoCapitalize="none"
                  />
                  <Pressable style={styles.eyeBtn} onPress={() => setShowPw2((v) => !v)}>
                    <Image
                      source={
                        showPw2
                          ? require("../assets/images/eye-on.png")
                          : require("../assets/images/eye-off.png")
                      }
                      style={styles.eyeImg}
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>

                {/* 이름 */}
                <Text style={[styles.label, { marginTop: 14 }]}>이름</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                {/* 생년월일 */}
                <Text style={[styles.label, { marginTop: 14 }]}>생년월일</Text>
                <View style={styles.birthRow}>
                  <TextInput
                    style={styles.birthInput}
                    placeholder="년(4자)"
                    value={birthY}
                    onChangeText={setBirthY}
                    keyboardType="number-pad"
                    maxLength={4}
                  />

                  <View style={styles.monthWrap}>
                    <Pressable style={styles.birthSelect} onPress={() => setMonthOpen((v) => !v)}>
                      <Text style={styles.birthText}>{monthLabel}</Text>
                      <Ionicons name="chevron-down" size={16} color="#222" />
                    </Pressable>

                    {monthOpen && (
                      <View style={styles.monthDropdown}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <Pressable
                            key={m}
                            onPress={() => pickMonth(m)}
                            style={({ pressed }) => [styles.monthItem, pressed && styles.monthItemPressed]}
                          >
                            {({ pressed }) => (
                              <Text style={[styles.monthItemText, pressed && styles.monthItemTextPressed]}>
                                {m}월
                              </Text>
                            )}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  <TextInput
                    style={styles.birthInput}
                    placeholder="일"
                    value={birthD}
                    onChangeText={setBirthD}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>

                {/* 이메일 */}
                <Text style={[styles.label, { marginTop: 14 }]}>이메일</Text>
                <View style={styles.emailRow}>
                  <TextInput
                    style={styles.emailInput}
                    value={emailLocal}
                    onChangeText={setEmailLocal}
                    autoCapitalize="none"
                  />
                  <View style={styles.emailSuffix}>
                    <Text style={styles.emailSuffixText}>@gmail.com</Text>
                  </View>
                </View>

                {/* 가입하기 */}
                <Pressable
                  disabled={submitting}
                  onPress={onRegister}
                  style={({ pressed }) => [
                    styles.submitBtn,
                    pressed && { backgroundColor: "#000" },
                    submitting && { opacity: 0.7 },
                  ]}
                >
                  {({ pressed }) => (
                    <Text style={[styles.submitText, pressed && { color: "#fff" }]}>
                      가입하기
                    </Text>
                  )}
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 아이디 중복 확인 모달(UI용) */}
      <Modal transparent animationType="fade" visible={dupOpen} onRequestClose={() => setDupOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>아이디 중복 확인</Text>
              <Pressable onPress={() => setDupOpen(false)} hitSlop={10}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.modalDivider} />
            <Text style={styles.modalMsg}>사용 가능한 아이디 입니다.</Text>

            <Pressable
              onPress={() => setDupOpen(false)}
              style={({ pressed }) => [styles.modalOkBtn, pressed && { backgroundColor: "#000" }]}
            >
              {({ pressed }) => (
                <Text style={[styles.modalOkText, pressed && { color: "#fff" }]}>
                  확인
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#6F675F" },
  bottomFill: { position: "absolute", left: 0, right: 0, bottom: 0 },

  topBar: { paddingHorizontal: 18, zIndex: 30 },
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
    overflow: "hidden", // ✅ 너 원래 디자인 유지
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,

    position: "relative",
    zIndex: 10,
  },

  paperBg: { flex: 1 },
  paperImg: { borderRadius: 22 },

  cardInner: { flex: 1, paddingHorizontal: 18, paddingTop: 18 },

  label: { fontFamily: "BodyFont", fontSize: 13, color: "#111", marginBottom: 6 },

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
    width: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeImg: { width: 22, height: 22 },

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

  monthWrap: {
    flex: 1,
    position: "relative",
    zIndex: 9999,
    elevation: 100,
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

  // ⚠️ 카드 overflow가 hidden이라 아래로 길게 나오면 잘릴 수 있음(너가 이미 겪은 문제)
  // 일단 UI 유지용으로 남김. 필요하면 "월 선택"은 모달 방식으로 바꿔야 완벽해짐.
  monthDropdown: {
    position: "absolute",
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: "#F2EFEA",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 9999,
    elevation: 200,
  },
  monthItem: { paddingVertical: 8, paddingHorizontal: 10 },
  monthItemPressed: { backgroundColor: "#000" },
  monthItemText: { fontFamily: "BodyFont", fontSize: 14, color: "#111" },
  monthItemTextPressed: { color: "#fff" },

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

  submitBtn: {
    marginTop: 30,
    height: 48,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: { fontFamily: "TitleFont", fontSize: 18, color: "#111" },

  backdrop: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1,
    elevation: 1,
  },

  // 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(245,241,234,0.98)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontFamily: "BodyFont", fontSize: 18, color: "#111" },
  modalClose: { fontSize: 18, color: "#111" },
  modalDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    marginTop: 10,
    marginBottom: 12,
  },
  modalMsg: { fontFamily: "BodyFont", fontSize: 14, color: "#111", marginBottom: 22 },
  modalOkBtn: {
    alignSelf: "center",
    minWidth: 110,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  modalOkText: { fontFamily: "BodyFont", fontSize: 15, color: "#111" },
});