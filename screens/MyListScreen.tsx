import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { getUserFavorites, getUserHistory, getUserWatchlist } from "@/services/db";
import { MainTabParamList } from "@/types/navigation";
import { Feather } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function PosterCard({ movie, onPress, width = 120 }: { movie: any; onPress: () => void; width?: number }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { width, opacity: pressed ? 0.8 : 1, marginRight: Spacing.md }
      ]}
    >
      <Image
        source={{ uri: movie.posterUrl || movie.poster_url }}
        style={{ width, height: width * 1.5, borderRadius: BorderRadius.sm, backgroundColor: Colors.dark.surface }}
        resizeMode="cover"
      />
      <ThemedText type="small" numberOfLines={1} style={{ marginTop: Spacing.xs, color: Colors.dark.text }}>
        {movie.title}
      </ThemedText>
    </Pressable>
  );
}


function CollapsibleSection({ title, data, renderItem }: { title: string; data: any[]; renderItem: any }) {
  const [collapsed, setCollapsed] = useState(false);

  if (data.length === 0) return null;

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setCollapsed(!collapsed)}
        style={styles.sectionHeaderButton}
      >
        <ThemedText type="h4" style={{ color: Colors.dark.text }}>{title}</ThemedText>
        <Feather name={collapsed ? "chevron-down" : "chevron-up"} size={20} color={Colors.dark.text} />
      </Pressable>

      {!collapsed && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

export default function MyListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user } = useAuth();

  const [history, setHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setHistory(getUserHistory(user.id));
        setFavorites(getUserFavorites(user.id));
        setWatchlist(getUserWatchlist(user.id));
      }
    }, [user])
  );

  const navigateToDetail = (item: any) => {
    navigation.navigate('HomeTab', {
      screen: 'Detail',
      params: {
        id: item.movie_id || item.id || "",
        title: item.title || "Unknown",
        posterUrl: item.poster_url || item.posterUrl || "",
        description: item.description || "",
        year: item.year || "",
        rating: item.rating || "",
        duration: item.duration || "",
        type: item.type || "movie",
      }
    });
  };

  const hasContent = history.length > 0 || favorites.length > 0 || watchlist.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + Spacing.xl, paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <ThemedText type="h1" style={styles.headerTitle}>My Library</ThemedText>
      </View>

      {!hasContent && (
        <View style={styles.emptyStateContainer}>
          <Feather name="bookmark" size={48} color={Colors.dark.textTertiary} />
          <ThemedText type="body" style={styles.emptyStateText}>
            Your library is empty.
          </ThemedText>
          <ThemedText type="small" style={styles.emptyStateSubtext}>
            Movies you watch or add to your list will appear here.
          </ThemedText>
        </View>
      )}

      <CollapsibleSection
        title="Watch Later"
        data={watchlist}
        renderItem={({ item }: { item: any }) => <PosterCard movie={item} onPress={() => navigateToDetail(item)} />}
      />

      <CollapsibleSection
        title="Favorites"
        data={favorites}
        renderItem={({ item }: { item: any }) => <PosterCard movie={item} onPress={() => navigateToDetail(item)} />}
      />

      <CollapsibleSection
        title="History"
        data={history}
        renderItem={({ item }: { item: any }) => <PosterCard movie={item} onPress={() => navigateToDetail(item)} />}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    color: Colors.dark.text,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingRight: Spacing.lg,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing["3xl"],
    gap: Spacing.md,
  },
  emptyStateText: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    color: Colors.dark.textTertiary,
  },
});
