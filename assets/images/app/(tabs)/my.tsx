// app/(tabs)/my.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  const name = "홍길동";
  const email = "gildong@gmail.com";

  const goArchive = () => {
    router.push("/(tabs)/archive");
  };

  const onLogout = () => {
    // 디자인 건드리지 않고, 일단 동작만(필요 없으면 이 함수 통째로 지워도 됨)
    Alert.alert("로그아웃", "로그아웃 할까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <View style={styles.outer}>
      {/* ✅ 전체 배경 */}
      <ImageBackground
        source={require("../../assets/images/bg_v2.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <StatusBar style="light" translucent />

        <SafeAreaView style={styles.safe} edges={["top"]}>
          {/* ===== 헤더 ===== */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Image
                source={require("../../assets/images/arrow_back.png")}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Text style={styles.headerTitle}>마이페이지</Text>

            <View style={{ marginLeft: "auto" }}>
              <Ionicons name="settings-outline" size={22} color="#ffffff" />
            </View>
          </View>

          {/* ===== 본문 ===== */}
          <View style={styles.body}>
            <View style={styles.paperShell}>
              <ImageBackground
                source={require("../../assets/images/bg_main.png")}
                style={styles.paper}
                resizeMode="cover"
              >
                {/* ⭐ 프로필 원형 (겹침 핵심) */}
                <View style={styles.avatarWrap}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={52} color="#6B6156" />
                  </View>
                  <View style={styles.badge}>
                    <Ionicons name="pencil" size={12} color="#fff" />
                  </View>
                </View>

                {/* ⭐ 네모 박스 (원형과 겹침) */}
                <View style={styles.infoBox}>
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.email}>{email}</Text>
                </View>

                {/* 버튼 */}
                <View style={styles.btnRow}>
                  <Pressable style={styles.btn} onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={18} color="#2A241D" />
                    <Text style={styles.btnText}>로그아웃</Text>
                  </Pressable>

                  {/* ✅ 여기만 기능 추가: 보관함으로 이동 */}
                  <Pressable style={styles.btn} onPress={goArchive}>
                    <Ionicons name="archive-outline" size={18} color="#2A241D" />
                    <Text style={styles.btnText}>보관함</Text>
                  </Pressable>
                </View>
              </ImageBackground>
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
    backgroundColor: "#6F665D",
  },
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

  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 34,
    paddingHorizontal: 18,
  },

  /* ===== 종이 한 장 ===== */
  paperShell: {
    width: "100%",
    maxWidth: 340,
    height: 440,
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
    paddingTop: 90, // ⭐ 겹침 공간 확보
    paddingHorizontal: 18,
    paddingBottom: 28,
    position: "relative",
  },

  /* ===== 원형 (위에 올라감) ===== */
  avatarWrap: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#F4EFE7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2F2922",
  },
  badge: {
    position: "absolute",
    right: 126,
    bottom: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E0B04A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  /* ===== 네모 박스 (겹침 핵심) ===== */
  infoBox: {
    marginTop: -40, // ⭐ 위로 올림
    backgroundColor: "rgba(245,239,230,0.95)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2F2922",
    paddingTop: 55, // ⭐ 원형이 덮어도 텍스트 안 겹치게
    paddingBottom: 20,
    alignItems: "center",
    zIndex: 1,
  },

  name: {
    fontFamily: "TitleFont",
    fontSize: 16,
    color: "#2A241D",
    marginBottom: 6,
  },
  email: {
    fontFamily: "BodyFont",
    fontSize: 13,
    color: "#4B4036",
  },

  btnRow: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#E0B04A",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#2F2922",
    elevation: 3,
    minWidth: 130,
    justifyContent: "center",
  },
  btnText: {
    fontFamily: "BodyFont",
    fontSize: 14,
    color: "#2A241D",
  },
});