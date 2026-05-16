import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Confession, formatKoreanDate, listConfessions } from '../../lib/confessions';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [item, setItem] = useState<Confession | null>(null);

  useEffect(() => {
    (async () => {
      const all = await listConfessions();
      const found = all.find((c) => c.id === id);
      setItem(found ?? null);
    })();
  }, [id]);

  if (!item) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>기록을 찾을 수 없음</Text>

        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>뒤로가기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>기록 상세</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.date}>{formatKoreanDate(item.createdAt)}</Text>

        <Text style={styles.label}>고해</Text>
        <Text style={styles.body}>{item.confess}</Text>

        <Text style={styles.label}>반전 질문</Text>
        <Text style={styles.body}>{item.flipQuestion}</Text>

        <Text style={styles.label}>다짐</Text>
        <Text style={styles.body}>{item.resolve}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0F14', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  backBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  backText: { color: 'white', fontSize: 18, fontWeight: '800' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '800' },

  title: { color: 'white', fontSize: 18, fontWeight: '800', marginBottom: 12 },

  card: {
    backgroundColor: '#121823',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#20293A',
  },
  date: { color: '#9AA0A6', fontSize: 12 },

  label: { color: '#D7DCE2', fontSize: 12, fontWeight: '700', marginTop: 4 },
  body: { color: 'white', fontSize: 14, lineHeight: 20 },

  btn: {
    alignSelf: 'flex-start',
    backgroundColor: '#2D6CDF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  btnText: { color: 'white', fontWeight: '700' },
});
