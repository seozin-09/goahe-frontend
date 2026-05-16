import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "../../components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="write"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="records" />
      <Tabs.Screen name="write" />
      <Tabs.Screen name="my" />

      {/* 탭에 안 보이게 숨김 */}
      <Tabs.Screen name="next" options={{ href: null }} />
      <Tabs.Screen name="next2" options={{ href: null }} />
      <Tabs.Screen name="save" options={{ href: null }} />
    </Tabs>
  );
}