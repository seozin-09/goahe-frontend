import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Confession = {
  id: string;
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "gohae_confessions";

/* 카드 */
const CARD_MAX_WIDTH = 340;
const CARD_HEIGHT = 560;
const CARD_RADIUS = 18;

/* 최근 순 버튼 */
const SORT_BTN_W = 92;
const SORT_BTN_H = 34;
const SORT_BTN_RADIUS = 10;

/* 노트 줄 설정 */
const RULE_THICKNESS = 1;
const RULE_GAP = 32;

/* 노트 줄 시작 위치 */
const RULE_START_Y = 104;
const CONTENT_TOP = RULE_START_Y - RULE_GAP + 6;
const RULE_COUNT = 13;

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function RecordsScreen() {
  const [items, setItems] = useState<Confession[]>([]);
  const [sortDesc, setSortDesc] = useState(true);

  const loadData = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: Confession[] = raw ? JSON.parse(raw) : [];
    setItems(Array.isArray(parsed) ? parsed : []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortDesc ? tb - ta : ta - tb;
    });
    return arr;
  }, [items, sortDesc]);

  const deleteFirst = useCallback(async () => {
    if (sorted.length === 0) return;
    const next = items.filter((it) => it.id !== sorted[0].id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setItems(next);
  }, [items, sorted]);

  return (
    <View style={styles.outer}>
      <ImageBackground
        source={require("../../assets/images/bg_v2.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <StatusBar style="light" translucent />

        <SafeAreaView style={styles.safe} edges={["top"]}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Image
                source={require("../../assets/images/arrow_back.png")}
                style={styles.backIcon}
              />
            </Pressable>
            <Text style={styles.headerTitle}>기록</Text>
          </View>

          <View style={styles.body}>
            <View style={styles.paperShell}>
              <ImageBackground
                source={require("../../assets/images/paper_v2.png")}
                style={styles.paper}
                resizeMode="stretch"
              >
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>기록</Text>

                  <Pressable
                    onPress={() => setSortDesc((v) => !v)}
                    style={styles.sortBtn}
                  >
                    <Text style={styles.sortText}>
                      {sortDesc ? "최근 순" : "오래된 순"}
                    </Text>
                    <Text style={styles.sortArrow}>▼</Text>
                  </Pressable>
                </View>

                <View style={styles.headerLine} />

                {/* 노트 줄 */}
                <View style={styles.rulesArea} pointerEvents="none">
                  {Array.from({ length: RULE_COUNT }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.rule,
                        { top: RULE_START_Y + i * RULE_GAP },
                      ]}
                    />
                  ))}
                </View>

                {/* 기록 리스트 */}
                <ScrollView
                  style={[
                    styles.listArea,
                    { top: CONTENT_TOP, height: RULE_GAP * RULE_COUNT },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  {sorted.map((item) => (
                    <View key={item.id} style={styles.row}>
                      <View style={styles.recordTextWrapper}>
                        <Text style={styles.recordDate} numberOfLines={1}>
                          {formatDate(item.createdAt)}
                        </Text>
                        <Text style={styles.recordText} numberOfLines={1}>
                          {item.text}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* ✅ 휴지통 하나만 (첫 줄 위치에 고정) */}
                <Pressable
                  onPress={deleteFirst}
                  disabled={sorted.length === 0}
                  style={[
                    styles.singleTrash,
                    sorted.length === 0 && styles.trashDisabled,
                  ]}
                >
                  <Image
                    source={require("../../assets/images/trash.png")}
                    style={styles.trashIcon}
                  />
                </Pressable>
              </ImageBackground>
            </View>
          </View>
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
  backIcon: { width: 22, height: 22, tintColor: "#fff" },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "TitleFont",
  },

  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 34,
    paddingHorizontal: 18,
  },

  paperShell: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },

  paper: {
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 18,
    position: "relative",
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontFamily: "TitleFont",
    fontSize: 34,
    color: "#111",
  },

  sortBtn: {
    width: SORT_BTN_W,
    height: SORT_BTN_H,
    borderRadius: SORT_BTN_RADIUS,
    borderWidth: 1.2,
    borderColor: "rgba(0,0,0,0.75)",
    backgroundColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  sortText: {
    fontFamily: "BodyFont",
    fontSize: 13,
    color: "#111",
  },

  sortArrow: { fontSize: 11, color: "#111" },

  headerLine: {
    marginTop: 14,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
  },

  rulesArea: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 0,
    bottom: 0,
  },

  rule: {
    position: "absolute",
    left: 0,
    right: 0,
    height: RULE_THICKNESS,
    backgroundColor: "rgba(0,0,0,0.14)",
  },

  listArea: {
    position: "absolute",
    left: 18,
    right: 18,
  },

  row: {
    height: RULE_GAP,
    justifyContent: "center",
  },

  recordTextWrapper: {
    height: RULE_GAP,
    justifyContent: "center",
  },

  recordDate: {
    fontFamily: "BodyFont",
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
    lineHeight: RULE_GAP / 2,
  },

  recordText: {
    fontFamily: "BodyFont",
    fontSize: 14,
    color: "#111",
    lineHeight: RULE_GAP / 2,
  },

  /* ✅ 휴지통 하나 */
  singleTrash: {
    position: "absolute",
    top: CONTENT_TOP,
    right: 18,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  trashDisabled: {
    opacity: 0.35,
  },

  trashIcon: {
    width: 20,
    height: 20,
    tintColor: "rgba(0,0,0,0.75)",
  },
});