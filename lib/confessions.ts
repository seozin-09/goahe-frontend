import AsyncStorage from "@react-native-async-storage/async-storage";

export type Confession = {
  id: string;
  text: string;
  createdAt: string;
};

const KEY = "CONFESSIONS";

// 전체 목록 가져오기
export async function listConfessions(): Promise<Confession[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// 저장
export async function addConfession(text: string) {
  const current = await listConfessions();

  const newItem: Confession = {
    id: Date.now().toString(),
    text,
    createdAt: new Date().toISOString(),
  };

  const next = [newItem, ...current];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

// ⭐ 개별 삭제 (records에서 사용)
export async function removeConfession(id: string) {
  const current = await listConfessions();
  const next = current.filter((c) => c.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

// ⭐ 전체 삭제 (my에서 사용)
export async function clearConfessions() {
  await AsyncStorage.removeItem(KEY);
}
