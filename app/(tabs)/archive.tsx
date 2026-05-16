// app/(tabs)/archive.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Confession = {
  id: string;
  title?: string;
  text: string;
  createdAt: string; // ISO
};

const STORAGE_KEY = "gohae_confessions";

type SortMode = "recent" | "old";

const fmt = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}(${hh}:${mi})`;
};

export default function ArchiveScreen() {
  const { width } = useWindowDimensions();

  const [items, setItems] = useState<Confession[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortMode === "recent" ? (tb || 0) - (ta || 0) : (ta || 0) - (tb || 0);
    });
    return arr;
  }, [items, sortMode]);

  const toggleSort = () => setSortMode((p) => (p === "recent" ? "old" : "recent"));

  const removeOne = async (id: string) => {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const onTrash = (id: string) => {
    Alert.alert("삭제", "이 기록을 삭제할까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => removeOne(id) },
    ]);
  };

  // 카드 크기(지금 스샷 느낌)
  const cardW = Math.min(width - 56, 360);
  const cardH = Math.round(cardW * 1.18);

  // 라벨/드롭다운 겹침 여백
  const TOP_PAD_FOR_CHIPS = 54;

  return (
    <View style={styles.outer}>
      <ImageBackground
        source={require("../../assets/images/bg_v2.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <StatusBar style="light" translucent />

        <SafeAreaView style={styles.safe} edges={["top"]}>
          {/* ===== 헤더 ===== */}
          <View style={styles.header}>
            {/* ✅ ← 보관함 누르면 무조건 마이페이지로 */}
            <Pressable onPress={() => router.replace("/(tabs)/my")} style={styles.backBtn}>
              <Image
                source={require("../../assets/images/arrow_back.png")}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Text style={styles.headerTitle}>보관함</Text>

            <View style={{ marginLeft: "auto" }}>
              <Ionicons name="download-outline" size={22} color="#ffffff" />
            </View>
          </View>

          {/* ===== 카드 ===== */}
          <View style={styles.body}>
            <View style={[styles.card, { width: cardW, height: cardH }]}>
              {/* 카드 위 라벨/정렬 */}
              <View style={styles.topChips}>
                <View style={styles.chipLeft}>
                  <Text style={styles.chipText}>보관함</Text>
                </View>

                <Pressable onPress={toggleSort} style={styles.chipRight} hitSlop={10}>
                  <Text style={styles.sortText}>
                    {sortMode === "recent" ? "최근 순" : "오래된 순"}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#2A241D" />
                </Pressable>
              </View>

              {/* 안쪽 회색(리스트 영역) */}
              <View style={[styles.inner, { marginTop: TOP_PAD_FOR_CHIPS }]}>
                {/* ✅ 기록 없으면 글씨 없이 비움 */}
                {sorted.length === 0 ? (
                  <View style={{ flex: 1 }} />
                ) : (
                  <View style={styles.row}>
                    <Text style={styles.rowText} numberOfLines={1}>
                      {((sorted[0].title && sorted[0].title.trim()) ||
                        (sorted[0].text?.trim()?.split("\n")[0] || "무제")) +
                        "  " +
                        fmt(sorted[0].createdAt)}
                    </Text>

                    <Pressable onPress={() => onTrash(sorted[0].id)} hitSlop={10}>
                      <Image
                        source={require("../../assets/images/trash.png")}
                        style={styles.trash}
                        resizeMode="contain"
                      />
                    </Pressable>
                  </View>
                )}
              </View>

              {/* 스티커 이미지가 있으면 여기서 absolute로 추가 */}
              {/*
              <Image source={require("../../assets/images/sticker1.png")} style={styles.sticker1} />
              <Image source={require("../../assets/images/sticker2.png")} style={styles.sticker2} />
              */}
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const BORDER = "#2F2922";

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
  backIcon: { width: 22, height: 22, tintColor: "#fff" },
  headerTitle: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "TitleFont",
  },

  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 26,
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: "#E8D58D",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 0,
    padding: 14,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },

  topChips: {
    position: "absolute",
    left: 14,
    right: 14,
    top: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },

  chipLeft: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F6F1E7",
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  chipText: {
    fontFamily: "TitleFont",
    fontSize: 14,
    color: "#2A241D",
  },

  chipRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F6F1E7",
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  sortText: {
    fontFamily: "BodyFont",
    fontSize: 13,
    color: "#2A241D",
  },

  inner: {
    flex: 1,
    backgroundColor: "#EDEAE6",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
  rowText: {
    flex: 1,
    marginRight: 10,
    fontFamily: "BodyFont",
    fontSize: 14,
    color: "#2A241D",
  },
  trash: { width: 18, height: 18 },

  // 스티커(선택)
  /*
  sticker1: {
    position: "absolute",
    left: -6,
    bottom: 26,
    width: 42,
    height: 42,
  },
  sticker2: {
    position: "absolute",
    left: 6,
    bottom: 8,
    width: 42,
    height: 42,
  },
  */
});