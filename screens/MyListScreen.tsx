
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import type { MainTabParamList } from "@/navigation/MainTabNavigator";
import { Movie } from "@/src/utils/movieUtils";
import { Feather } from "@expo/vector-icons";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React from "react";
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
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md) / COLUMN_COUNT;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

const HISTORY: Movie[] = [];
const FAVORITES: Movie[] = [];
const DOWNLOADS: Movie[] = [];

interface PosterCardProps {
  movie: Movie;
  onPress: () => void;
  width?: number;
}

function PosterCard({ movie, onPress, width = 128 }: PosterCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.posterCard,
        { width, opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <Image
        source={{ uri: movie.posterUrl }}
        style={[styles.posterImage, { width, height: width * 1.5 }]}
        resizeMode="cover"
      />
      <ThemedText type="body" style={styles.posterTitle} numberOfLines={1}>
        {movie.title}
      </ThemedText>
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <ThemedText type="h3" style={styles.sectionTitle}>
      {title}
    </ThemedText>
  );
}

export default function MyListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const navigateToDetail = (movie: Movie) => {
    // @ts-ignore - The navigation types are a bit complex between tab/stack
    navigation.getParent()?.navigate('HomeTab', {
      screen: 'Detail',
      params: {
        id: movie.id,
        title: movie.title,
        posterUrl: movie.backdropUrl || movie.posterUrl,
        description: movie.description || "",
        year: movie.year,
        rating: movie.rating,
        duration: movie.duration,
        type: movie.type,
      }
    });
  };

  const renderPosterItem = ({ item }: { item: Movie }) => (
    <PosterCard
      movie={item}
      onPress={() => navigateToDetail(item)}
    />
  );

  const hasContent = HISTORY.length > 0 || FAVORITES.length > 0 || DOWNLOADS.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <ThemedText type="h3" style={styles.headerTitle}>My List</ThemedText>
      </View>

      {!hasContent && (
        <View style={styles.emptyStateContainer}>
          <Feather name="bookmark" size={48} color={Colors.dark.textTertiary} />
          <ThemedText type="body" style={styles.emptyStateText}>
            Your list is empty.
          </ThemedText>
          <ThemedText type="small" style={styles.emptyStateSubtext}>
            Movies and shows you add to your list will appear here.
          </ThemedText>
        </View>
      )}

      {HISTORY.length > 0 && (
        <>
          <SectionHeader title="History" />
          <FlatList
            data={HISTORY}
            renderItem={renderPosterItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
          />
        </>
      )}

      {FAVORITES.length > 0 && (
        <>
          <SectionHeader title="Favorites" />
          <FlatList
            data={FAVORITES}
            renderItem={renderPosterItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
          />
        </>
      )}

      {DOWNLOADS.length > 0 && (
        <>
          <SectionHeader title="Downloads" />
          <FlatList
            data={DOWNLOADS}
            renderItem={renderPosterItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  contentContainer: {
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: "700",
  },
  sectionTitle: {
    color: Colors.dark.text,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  posterCard: {
    gap: Spacing.sm,
  },
  posterImage: {
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.surface,
  },
  posterTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing['3xl'],
    gap: Spacing.sm,
  },
  emptyStateText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    maxWidth: "70%",
  },
});
