import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
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

/* =========================
   🔥 선 완전 수동 조절 영역
   ========================= */
const LINE_LEFT = -5;
const LINE_RIGHT = -5;
const LINE_TOP = 8;
const LINE_THICKNESS = 1;
/* ========================= */

function DeleteModal({
  visible,
  onClose,
  onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  const insets = useSafeAreaInsets();

  // ✅ 닫힘 애니메이션 위해: visible=false여도 잠깐 렌더 유지
  const [mounted, setMounted] = useState(false);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  const openAnim = () => {
    overlayOpacity.setValue(0);
    cardOpacity.setValue(0);
    translateY.setValue(18);
    scale.setValue(0.97);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAnim = (done?: () => void) => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 18,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        done?.();
      }
    });
  };

  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(openAnim);
    } else if (mounted) {
      closeAnim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!mounted) return null;

  return (
    <View style={modalStyles.root} pointerEvents="auto">
      <Animated.View
        style={[modalStyles.backdrop, { opacity: overlayOpacity }]}
      />

      {/* ✅ 바깥 터치로 닫기 (터치 충돌 방지) */}
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={onClose}
        pointerEvents="box-only"
      />

      <Animated.View
        style={[
          modalStyles.cardWrap,
          {
            paddingBottom: 16 + Math.max(insets.bottom, 0),
            opacity: cardOpacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <Image
          source={require("../../assets/images/paper_v2.png")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="stretch"
        />

        <View style={modalStyles.content}>
          <View style={modalStyles.headerRow}>
            <Text style={modalStyles.headerTitle}>2.삭제</Text>

            <Pressable
              onPress={onDelete}
              hitSlop={10}
              style={modalStyles.trashBtn}
            >
              <Image
                source={require("../../assets/images/trash.png")}
                style={modalStyles.trash}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <View style={modalStyles.headerLine} />

          <Text style={modalStyles.bodyText}>
            오늘의 고백을 삭제할까요?{"\n"}
            당신의 죄책감을 덜어드립니다!
          </Text>

          <Text style={modalStyles.bodyText}>
            {"\n"}정말로 죄책감이 지워지지도 않는데, 이게 왜 필요하냐고요?
          </Text>

          <Text style={modalStyles.bodyText}>
            {"\n"}실제 감정에는 아무런 변화가 없더라도,{"\n"}
            당신의 죄책감을 조금이나마 덜어주고 싶은{"\n"}
            저희의 성의라고 생각하시죠!
          </Text>

          <View style={modalStyles.btnRow}>
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [
                modalStyles.btn,
                pressed && modalStyles.btnPressed,
              ]}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    modalStyles.btnText,
                    pressed && modalStyles.btnTextPressed,
                  ]}
                >
                  삭제하기
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                modalStyles.btn,
                pressed && modalStyles.btnPressed,
              ]}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    modalStyles.btnText,
                    pressed && modalStyles.btnTextPressed,
                  ]}
                >
                  돌아가기
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  cardWrap: {
    position: "absolute",
    left: 20,
    right: 50,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  content: { paddingHorizontal: 18, paddingTop: 18 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontFamily: "TitleFont", fontSize: 24, color: "#111" },
  trashBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  trash: { width: 22, height: 22 },
  headerLine: {
    marginTop: 10,
    height: 1.2,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  bodyText: {
    marginTop: 10,
    fontFamily: "BodyFont",
    fontSize: 15,
    color: "#111",
    lineHeight: 21,
  },
  btnRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 20,
    paddingBottom: 16,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.7)",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontFamily: "BodyFont", fontSize: 15, color: "#111" },
  btnPressed: { backgroundColor: "#222", borderColor: "#222" },
  btnTextPressed: { color: "#fff" },
});

export default function WriteScreen() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ 화면 전체 페이드(크로스페이드용)
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const canSubmit = useMemo(() => text.trim().length > 0, [text]);

  // ✅ 작성완료 -> 2번 화면(삭제 모달)로
  const onSubmit = () => {
    if (!text.trim()) return;
    setShowDeleteModal(true);
  };

  const closeModal = () => setShowDeleteModal(false);

  // ✅ 삭제하기: 모달 닫힘(애니메이션) → 화면 페이드아웃 → next 이동
  const onPressDelete = () => {
    setShowDeleteModal(false);

    // 모달 닫힘 애니메이션이 끝날 즈음부터 화면 전체 페이드아웃
    setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        setText("");
        router.replace("/next"); // app/next.tsx
        // (다음에 다시 이 화면으로 올 때를 대비해 1로 복구)
        screenOpacity.setValue(1);
      });
    }, 160);
  };

  return (
    <View style={styles.outer}>
      <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
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

                    <Text style={styles.section}>1. 오늘의 고백</Text>

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
                        style={[
                          styles.btnGray,
                          !canSubmit && styles.btnDisabled,
                        ]}
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

              <DeleteModal
                visible={showDeleteModal}
                onClose={closeModal}
                onDelete={onPressDelete}
              />
            </KeyboardAvoidingView>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>
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