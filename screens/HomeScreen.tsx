import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Movie, getActionMovies, getComedyMovies, getDramaMovies, getNewReleases, getTopMovies, getTrendingMovies } from "@/src/utils/movieUtils";
import type { HomeStackParamList } from "@/types/navigation";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Home">;
};



const CONTINUE_WATCHING: Movie[] = [];

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

interface ContinueWatchingCardProps {
  movie: Movie;
  onPress: () => void;
}

function ContinueWatchingCard({ movie, onPress }: ContinueWatchingCardProps) {
  const cardWidth = 192;
  const cardHeight = cardWidth * (9 / 16);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.continueCard,
        { width: cardWidth, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <ImageBackground
        source={{ uri: movie.posterUrl }}
        style={[styles.continueImage, { height: cardHeight }]}
        imageStyle={styles.continueImageStyle}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
          style={styles.continueGradient}
        />
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <Feather name="play" size={24} color={Colors.dark.text} />
          </View>
        </View>
        <View style={styles.continueContent}>
          <ThemedText type="body" style={styles.continueTitle} numberOfLines={1}>
            {movie.title}
          </ThemedText>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(movie.progress || 0) * 100}%` }
                ]}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

interface SectionHeaderProps {
  title: string;
  onAction?: () => void;
  actionLabel?: string;
}

function SectionHeader({ title, onAction, actionLabel }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeaderContainer}>
      <ThemedText type="h3" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {onAction && (
        <Pressable onPress={onAction} style={styles.sectionActionButton}>
          <ThemedText type="body" style={styles.sectionActionText}>
            {actionLabel || "See All"}
          </ThemedText>
          <Feather name="chevron-right" size={16} color={Colors.dark.primary} />
        </Pressable>
      )}
    </View>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();


  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [newReleaseMovies, setNewReleaseMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);

  const flatRef = useRef<FlatList>(null);
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const [top, trending, newRel, action, comedy, drama] = await Promise.all([
        getTopMovies(),
        getTrendingMovies(),
        getNewReleases(),
        getActionMovies(),
        getComedyMovies(),
        getDramaMovies(),
      ]);
      setTopMovies(top);
      setTrendingMovies(trending);
      setNewReleaseMovies(newRel);
      setActionMovies(action);
      setComedyMovies(comedy);
      setDramaMovies(drama);

      // Fetch history for Continue Watching
      if (user) {
        const historyData = require('@/services/db').getUserHistory(user.id);
        const formattedHistory = historyData.map((h: any) => ({
          id: h.movie_id,
          title: h.title,
          posterUrl: h.poster_url,
          backdropUrl: h.poster_url, // fallback
          description: "",
          year: "",
          rating: "",
          duration: "",
          type: "movie",
          progress: 0.5, // mock progress
        }));
        setContinueWatching(formattedHistory);
      }

      // Preload images (subset)
      [...top, ...trending].forEach(movie => {
        if (movie.backdropUrl) Image.prefetch(movie.backdropUrl);
      });
    };
    fetchMovies();
  }, [user]);

  useEffect(() => {
    if (topMovies.length === 0) return;
    const interval = setInterval(() => {
      const nextIdx = (currentIndex + 1) % topMovies.length;
      const targetIndex = nextIdx === 0 ? topMovies.length : nextIdx;
      flatRef.current?.scrollToIndex({ index: targetIndex, animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [topMovies, currentIndex]);

  const carouselData = [...topMovies, ...topMovies];

  const featuredMovie = topMovies[currentIndex] || {
    id: "default",
    title: "Loading...",
    posterUrl: "",
    backdropUrl: "",
    description: "",
    year: "",
    rating: "",
    duration: "",
    type: "movie" as const,
  };

  const renderBanner = (movie: Movie) => (
    <ImageBackground
      source={{ uri: movie.backdropUrl }}
      style={styles.heroBanner}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["transparent", "rgba(28, 16, 34, 0.5)", "rgba(28, 16, 34, 0.95)"]}
        locations={[0, 0.5, 1]}
        style={styles.heroGradient}
      />
      <View style={styles.heroContent}>
        <ThemedText type="h1" style={styles.heroTitle}>
          {movie.title}
        </ThemedText>
        <ThemedText type="small" style={styles.heroDescription} numberOfLines={3}>
          {movie.description}
        </ThemedText>
        <View style={styles.heroButtons}>
          <Pressable
            onPress={() => navigateToDetail(movie)}
            style={({ pressed }) => [
              styles.playButtonLarge,
              { opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <Feather name="play" size={20} color={Colors.dark.text} />
            <ThemedText type="body" style={styles.buttonText}>Play</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => navigateToDetail(movie)}
            style={({ pressed }) => [
              styles.moreInfoButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Feather name="info" size={20} color={Colors.dark.text} />
            <ThemedText type="body" style={styles.buttonText}>More Info</ThemedText>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );

  const navigateToDetail = (movie: Movie) => {
    navigation.navigate("Detail", {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.backdropUrl || movie.posterUrl,
      description: movie.description || "",
      year: movie.year,
      rating: movie.rating,
      duration: movie.duration,
      type: movie.type,
    });
  };

  const renderPosterItem = ({ item }: { item: Movie }) => (
    <PosterCard
      movie={item}
      onPress={() => navigateToDetail(item)}
    />
  );

  const renderContinueItem = ({ item }: { item: Movie }) => (
    <ContinueWatchingCard
      movie={item}
      onPress={() => navigateToDetail(item)}
    />
  );

  const renderNewReleaseItem = ({ item }: { item: Movie }) => (
    <PosterCard
      movie={item}
      onPress={() => navigateToDetail(item)}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroContainer}>
        <FlatList
          ref={flatRef}
          data={carouselData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ width: SCREEN_WIDTH }}>
              <Pressable
                onPress={() => navigateToDetail(item)}
                style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
              >
                {renderBanner(item)}
              </Pressable>
            </View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onMomentumScrollEnd={(event) => {
            const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            if (page >= topMovies.length) {
              flatRef.current?.scrollToIndex({ index: 0, animated: false });
              setCurrentIndex(0);
            } else {
              setCurrentIndex(page);
            }
          }}
          getItemLayout={(data, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
          initialScrollIndex={0}
        />
      </View>

      <SectionHeader
        title="Trending Now"
        onAction={() => navigation.navigate("Browse")}
        actionLabel="Explore All"
      />
      <FlatList
        data={trendingMovies}
        renderItem={renderPosterItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
      />

      {continueWatching.length > 0 && (
        <View style={{ marginBottom: Spacing.lg }}>
          <SectionHeader title="Continue Watching" />
          <FlatList
            data={continueWatching}
            renderItem={renderContinueItem}
            keyExtractor={(item, index) => `continue-${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
          />
        </View>
      )}

      {continueWatching.length > 0 && (
        <View style={{ marginBottom: Spacing.lg }}>
          <SectionHeader title="Continue Watching" />
          <FlatList
            data={continueWatching}
            renderItem={renderContinueItem}
            keyExtractor={(item, index) => `continue-${item.id}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
          />
        </View>
      )}



      <SectionHeader title="New Releases" />
      <FlatList
        data={newReleaseMovies}
        renderItem={renderNewReleaseItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
      />

      <SectionHeader title="Action Movies" />
      <FlatList
        data={actionMovies}
        renderItem={renderPosterItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
      />

      <SectionHeader title="Comedy Hits" />
      <FlatList
        data={comedyMovies}
        renderItem={renderPosterItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
      />

      <SectionHeader title="Dramas" />
      <FlatList
        data={dramaMovies}
        renderItem={renderPosterItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
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
    paddingTop: 0,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 480,
    overflow: 'hidden',
  },
  heroBanner: {
    width: SCREEN_WIDTH,
    height: 480,
    justifyContent: "flex-end",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  heroTitle: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: "700",
  },
  heroDescription: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    maxWidth: "90%",
  },
  heroButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  playButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.xl,
    height: 48,
    borderRadius: BorderRadius.sm,
    minWidth: 100,
  },
  moreInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.dark.overlay,
    paddingHorizontal: Spacing.xl,
    height: 48,
    borderRadius: BorderRadius.sm,
    minWidth: 120,
  },
  buttonText: {
    color: Colors.dark.text,
    fontWeight: "700",
  },

  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.dark.text,
  },
  sectionActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  sectionActionText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: "600",
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
  continueCard: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  continueImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  continueImageStyle: {
    borderRadius: BorderRadius.sm,
  },
  continueGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.sm,
  },
  playButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  continueContent: {
    position: "absolute",
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
  },
  continueTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  progressContainer: {
    width: "100%",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.dark.primary,
    borderRadius: 2,
  },
});
