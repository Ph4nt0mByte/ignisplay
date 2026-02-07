import { HeaderActions, HeaderTitle } from "@/components/HeaderTitle";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import BrowseScreen from "@/screens/BrowseScreen";
import DetailScreen from "@/screens/DetailScreen";
import HomeScreen from "@/screens/HomeScreen";
import type { HomeStackParamList, MainTabParamList } from "@/types/navigation";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeScreenWithHeader() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <HeaderActions

      onProfilePress={() => navigation.navigate("ProfileTab", { screen: "Profile" })}
    />
  );
}

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
        contentStyle: {
          backgroundColor: Colors.dark.backgroundRoot,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Ignisplay" />,
          headerRight: () => <HomeScreenWithHeader />,
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: "rgba(28, 16, 34, 0.8)",
          },
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: Colors.dark.text,
        }}
      />
      <Stack.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          headerTitle: "Explore",
          headerStyle: {
            backgroundColor: Colors.dark.backgroundRoot,
          },
          headerTintColor: Colors.dark.text,
        }}
      />
    </Stack.Navigator>
  );
}
