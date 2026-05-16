import React, { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Easing,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteModal({ visible, onClose, onDelete }: Props) {
  const insets = useSafeAreaInsets();

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    if (!visible) return;

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
  }, [visible, overlayOpacity, cardOpacity, translateY, scale]);

  const cardStyle = useMemo(
    () => [
      styles.cardWrap,
      {
        paddingBottom: 16 + Math.max(insets.bottom, 0),
        opacity: cardOpacity,
        transform: [{ translateY }, { scale }],
      },
    ],
    [insets.bottom, cardOpacity, translateY, scale]
  );

  if (!visible) return null;

  return (
    <View style={styles.root} pointerEvents="auto">
      {/* ✅ 화면 전체 어둡게 (뒤 화면은 그대로 보이되 어두워짐) */}
      <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]} />
      {/* ✅ 바깥 터치로 닫기 */}
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

      {/* ✅ 모달 카드 */}
      <Animated.View style={cardStyle}>
        <Image
          source={require("../assets/images/paper_v2.png")}
          style={styles.paper}
          resizeMode="stretch"
        />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>2.삭제</Text>
            <Pressable onPress={onDelete} hitSlop={10} style={styles.trashBtn}>
              <Image
                source={require("../assets/images/trash.png")}
                style={styles.trash}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <View style={styles.headerLine} />

          <Text style={styles.bodyText}>
            오늘의 고백을 삭제할까요?{"\n"}
            당신의 죄책감을 덜어드립니다!
          </Text>

          <Text style={styles.bodyText}>
            {"\n"}정말로 죄책감이 지워지지도 않는데, 이게 왜 필요하냐고요?
          </Text>

          <Text style={styles.bodyText}>
            {"\n"}실제 감정에는 아무런 변화가 없더라도,{"\n"}
            당신의 죄책감을 조금이나마 덜어주고 싶은{"\n"}
            저희의 성의라고 생각하시죠!
          </Text>

          <View style={styles.btnRow}>
            <Pressable style={styles.btn} onPress={onDelete}>
              <Text style={styles.btnText}>삭제하기</Text>
            </Pressable>

            <Pressable style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>돌아가기</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: "86%",
    maxWidth: 420,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  paper: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: "TitleFont",
    fontSize: 24,
    color: "#1f1f1f",
  },
  trashBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  trash: { width: 22, height: 22 },

  headerLine: {
    marginTop: 10,
    height: 1.5,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  bodyText: {
    marginTop: 10,
    fontFamily: "BodyFont",
    fontSize: 14.5,
    lineHeight: 20,
    color: "#2a2a2a",
  },

  btnRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 14,
    paddingBottom: 16,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  btnText: {
    fontFamily: "BodyFont",
    fontSize: 15,
    color: "#1f1f1f",
  },
});