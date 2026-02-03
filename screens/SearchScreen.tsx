import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { Movie, searchMovies } from "@/src/utils/movieUtils";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const recentSearches: string[] = [];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setLoading(true);
        try {
          const movies = await searchMovies(searchQuery);
          setResults(movies);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const navigateToDetail = (movie: Movie) => {
    navigation.navigate("HomeTab", {
      screen: "Detail",
      params: {
        id: movie.id,
        title: movie.title,
        posterUrl: movie.backdropUrl || movie.posterUrl,
        description: movie.description || "",
        year: movie.year,
        rating: movie.rating,
        duration: movie.duration,
        type: movie.type,
      },
    });
  };

  const renderSearchItem = ({ item }: { item: Movie }) => (
    <Pressable
      onPress={() => navigateToDetail(item)}
      style={({ pressed }) => [
        styles.resultItem,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <Image
        source={{ uri: item.posterUrl }}
        style={styles.resultImage}
        resizeMode="cover"
      />
      <View style={styles.resultInfo}>
        <ThemedText type="body" style={styles.resultTitle}>{item.title}</ThemedText>
        <View style={styles.resultMeta}>
          <ThemedText type="small" style={styles.resultYear}>{item.year}</ThemedText>
          <ThemedText type="small" style={styles.resultType}>
            {item.type === 'series' ? 'TV Series' : 'Movie'}
          </ThemedText>
        </View>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={12} color={Colors.dark.primary} />
          <ThemedText type="small" style={styles.ratingText}>{item.rating}</ThemedText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <ThemedText type="h3" style={styles.title}>Search</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={Colors.dark.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search for movies, series..."
            placeholderTextColor={Colors.dark.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={18} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
          </View>
        ) : searchQuery.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderSearchItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <ThemedText type="body" style={styles.emptyText}>No results found</ThemedText>
              </View>
            }
          />
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.recentHeader}>
              <ThemedText type="body" style={styles.sectionTitle}>Recent Searches</ThemedText>
              <TouchableOpacity onPress={() => { }}>
                <ThemedText type="small" style={styles.clearText}>Clear All</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.searchesContainer}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Feather name="clock" size={16} color={Colors.dark.textSecondary} />
                  <ThemedText style={styles.searchItemText}>{search}</ThemedText>
                  <TouchableOpacity>
                    <Feather name="x" size={16} color={Colors.dark.textSecondary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.dark.text,
    flex: 1,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.md,
    color: Colors.dark.text,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  clearText: {
    color: Colors.dark.primary,
  },
  searchesContainer: {
    gap: Spacing.md,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.backgroundSecondary,
  },
  searchItemText: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsList: {
    paddingBottom: Spacing.xl,
  },
  resultItem: {
    flexDirection: "row",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  resultImage: {
    width: 80,
    height: 120,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.surface,
  },
  resultInfo: {
    flex: 1,
    justifyContent: "center",
  },
  resultTitle: {
    color: Colors.dark.text,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  resultYear: {
    color: Colors.dark.textSecondary,
  },
  resultType: {
    color: Colors.dark.textSecondary,
    textTransform: "capitalize",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  ratingText: {
    color: Colors.dark.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing['3xl'],
  },
  emptyText: {
    color: Colors.dark.textSecondary,
  },
});
