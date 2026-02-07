import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } from "@/services/db";
import type { HomeStackParamList, RootStackParamList } from "@/types/navigation";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
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

type DetailScreenProps = {
  route: RouteProp<HomeStackParamList, "Detail">;
};

interface CastMember {
  id: string;
  name: string;
  character: string;
}

const CAST_DATA: CastMember[] = [
  { id: "1", name: "Ryan Gosling", character: "K" },
  { id: "2", name: "Harrison Ford", character: "Rick Deckard" },
  { id: "3", name: "Ana de Armas", character: "Joi" },
  { id: "4", name: "Jared Leto", character: "Niander Wallace" },
  { id: "5", name: "Robin Wright", character: "Lieutenant Joshi" },
];

interface SimilarMovie {
  id: string;
  title: string;
  posterUrl: string;
}

const SIMILAR_MOVIES: SimilarMovie[] = [
  {
    id: "similar-1",
    title: "Ex Machina",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlgkAPJMAHUOVwx4BARWT-HoaEcNClz0CrcXGZMyvBsL8IO2FqYrYvPzrGs_Jp-wGcVU5QcPllWs6Cfl_xdF8erYG-0BOP70KexYGNKW0LMdylzNveNQnXQKSK9I70BclHsEDvT68gxtcyeFNMTpVoWrNiRRsbVHaN3JESLpZRKJwA8FvgccFTGHdGhPPimxYhs4-n_1qOxiSJib_k9kOaDejpwEwBcVAYm_g0yRBLxovW4qbvTIOSZAzg9TQ4cugoNwNJ3dwzlEo",
  },
  {
    id: "similar-2",
    title: "Ghost in the Shell",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlQ-jEAa50ISVPno9Sf-EqO4PyQ5ggRGYMBTvWWUIYALJ1erxztMA5PjyvhWc3Wh75ZX3cUZvDuDOF_3ZscO3zxJ9EDbLv66fLWgX8gztfUGOKvNyxpyjySax_-j-gOULeujnThUk3pU1FLp9Wc8Fr9VFQodJqRJRWQKhG9beu6yQnNnVSN1XC6lnZgsuDgSljddSBsPgTz3zx4intUoh_1CdIj5FNCpFhkh5dsjAhYP28gR6JX2gHbezTYtKQvRfhi8M0kSqPzbU",
  },
  {
    id: "similar-3",
    title: "Minority Report",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhkWknNaZegj_a3wnYVfqUH1jnI_crAuxAh35oHXja0MuJaH9HRn6e-180VPdmrXUmaFLWBYrX1D4YC6K1PAcgpyqAxVz_rREpPqO2FxOnqBe6ynpY1GJh2RxeTNTAu4hj4RCrGVZ87xEDlHdJAnQB90B2leIMtCcqprPBAC2sujg-mNX62wyzet5r7B838GOuvfeqgPg7_PRkSkNYkibEXGPMa2c95cyinSNZrggv3PiNCafEpdd_9ouEEapkUqZl31LbGM9HhHY",
  },
  {
    id: "similar-4",
    title: "Arrival",
    posterUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZD887buXk2lekdnilHbHH0v7LEr9ohs-Yv8I0-rjpRN0mbGAVOYKeluXM8dFB9qQjrkv0CAwWvjpONfypS4ttpxbyi6Xaf73wv0sbp4mMDfZNO292eeWYcRJuTvs9osViBlqI5R_j8wKeALMmFvXA_j7y-Znm8SAR707YkdqvK2s7VmXHFmoUgYUsOznWbOZ1oQaTaTAHTR7FWyCLIbQ6zM8EkzTMY-GoQHKeT-QpdEnLG3RS0Kv-xSNuEl3bwONs6TucCdNayik",
  },
];

function CastCard({ cast }: { cast: CastMember }) {
  return (
    <View style={styles.castCard}>
      <View style={styles.castAvatar}>
        <Feather name="user" size={20} color={Colors.dark.textTertiary} />
      </View>
      <View style={styles.castInfo}>
        <ThemedText type="small" style={styles.castName} numberOfLines={1}>
          {cast.name}
        </ThemedText>
        <ThemedText type="small" style={styles.castCharacter} numberOfLines={1}>
          {cast.character}
        </ThemedText>
      </View>
    </View>
  );
}

function SimilarCard({ movie, onPress }: { movie: SimilarMovie; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.similarCard,
        { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <Image
        source={{ uri: movie.posterUrl }}
        style={styles.similarImage}
        resizeMode="cover"
      />
      <ThemedText type="small" style={styles.similarTitle} numberOfLines={1}>
        {movie.title}
      </ThemedText>
    </Pressable>
  );
}

export default function DetailScreen({ route }: DetailScreenProps) {
  const { id, title, posterUrl, description, year, rating, duration, type } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  useEffect(() => {
    if (user && id) {
      setInWatchlist(isInWatchlist(user.id, id));
      setInFavorites(isFavorite(user.id, id));
    }
  }, [user, id]);

  const handlePlayVideo = () => {
    navigation.navigate("VideoPlayer", { title, id, type, posterUrl });
  };

  const handleToggleWatchlist = () => {
    if (user && id) {
      const added = toggleWatchlist(user.id, { id, title, posterUrl });
      setInWatchlist(added);
    }
  };

  const handleToggleFavorite = () => {
    if (user && id) {
      const added = toggleFavorite(user.id, { id, title, posterUrl });
      setInFavorites(added);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: posterUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(28, 16, 34, 0.7)", Colors.dark.backgroundRoot]}
          locations={[0, 0.6, 1]}
          style={styles.heroGradient}
        />
        <View style={[styles.headerActions, { top: insets.top + Spacing.lg }]}>
          <Pressable
            onPress={handleToggleFavorite}
            style={({ pressed }) => [
              styles.bookmarkButton,
              { opacity: pressed ? 0.7 : 1, marginRight: Spacing.sm }
            ]}
          >
            <Feather
              name="heart"
              size={24}
              color={inFavorites ? Colors.dark.primary : Colors.dark.text}
            />
          </Pressable>
          <Pressable
            onPress={handleToggleWatchlist}
            style={({ pressed }) => [
              styles.bookmarkButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Feather
              name={inWatchlist ? "check" : "plus"}
              size={24}
              color={inWatchlist ? Colors.dark.primary : Colors.dark.text}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.contentSection}>
        <ThemedText type="h1" style={styles.title}>{title}</ThemedText>

        <View style={styles.metadata}>
          {year ? (
            <View style={styles.metaItem}>
              <ThemedText type="small" style={styles.metaText}>{year}</ThemedText>
            </View>
          ) : null}
          {rating ? (
            <View style={styles.metaItem}>
              <Feather name="star" size={14} color={Colors.dark.primary} />
              <ThemedText type="small" style={styles.metaText}>{rating}</ThemedText>
            </View>
          ) : null}
          {duration ? (
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={Colors.dark.textTertiary} />
              <ThemedText type="small" style={styles.metaText}>{duration}</ThemedText>
            </View>
          ) : null}
          {type ? (
            <View style={styles.typeBadge}>
              <ThemedText type="small" style={styles.typeText}>
                {type === "series" ? "Series" : "Movie"}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText type="body" style={styles.description}>
          {description}
        </ThemedText>

        <View style={styles.actionButtons}>
          <Pressable
            onPress={handlePlayVideo}
            style={({ pressed }) => [
              styles.playButton,
              { opacity: pressed ? 0.9 : 1, width: "100%", marginBottom: Spacing.sm }
            ]}
          >
            <Feather name="play" size={20} color={Colors.dark.text} />
            <ThemedText type="body" style={styles.playButtonText}>Play</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.8 : 1, width: "100%", marginBottom: Spacing.md }
            ]}
          >
            <Feather name="download" size={20} color={Colors.dark.text} />
            <ThemedText type="body" style={styles.secondaryButtonText}>Download</ThemedText>
          </Pressable>

          <View style={styles.secondaryActions}>
            <Pressable
              onPress={handleToggleWatchlist}
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.8 : 1, backgroundColor: inWatchlist ? Colors.dark.primary : Colors.dark.surface }
              ]}
            >
              <Feather
                name={inWatchlist ? "check" : "bookmark"}
                size={20}
                color={Colors.dark.text}
              />
              <ThemedText type="body" style={styles.secondaryButtonText}>
                {inWatchlist ? "Saved" : "Watch Later"}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleToggleFavorite}
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.8 : 1, backgroundColor: inFavorites ? Colors.dark.primary : Colors.dark.surface }
              ]}
            >
              <Feather
                name={inFavorites ? "heart" : "heart"}
                size={20}
                color={Colors.dark.text}
                style={inFavorites ? {} : {}}
              />
              <ThemedText type="body" style={styles.secondaryButtonText}>
                {inFavorites ? "Favorited" : "Favorite"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Watch Trailer Section */}
      <View style={styles.trailerSection}>
        <ThemedText type="h4" style={styles.sectionTitle}>Watch Trailer</ThemedText>
        <Pressable onPress={handlePlayVideo} style={styles.trailerContainer}>
          <LinearGradient
            colors={["rgba(173, 43, 238, 0.1)", "rgba(173, 43, 238, 0.3)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.trailerThumbnail}
          >
            <View style={styles.playButtonContainer}>
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]}
                style={styles.trailerPlayButton}
              >
                <Feather name="play" size={24} color={Colors.dark.text} />
              </LinearGradient>
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Cast & Crew</ThemedText>
        <FlatList
          data={CAST_DATA}
          renderItem={({ item }) => <CastCard cast={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.castList}
          ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Similar Titles</ThemedText>
        <FlatList
          data={SIMILAR_MOVIES}
          renderItem={({ item }) => (
            <SimilarCard movie={item} onPress={() => { }} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.similarList}
          ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  contentContainer: {
    paddingBottom: Spacing["3xl"],
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 400,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerActions: {
    position: "absolute",
    right: Spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
  },
  bookmarkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentSection: {
    padding: Spacing.lg,
    marginTop: -80,
  },
  title: {
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    color: Colors.dark.textSecondary,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.dark.primary,
    borderRadius: BorderRadius.xs,
  },
  typeText: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 12,
  },
  description: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xl,
  },
  actionButtons: {
    flexDirection: "column",
    gap: 0,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.dark.primary,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  playButtonText: {
    color: Colors.dark.text,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.dark.surface,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  secondaryButtonText: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  trailerSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  trailerContainer: {
    width: "100%",
    height: 180,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  trailerThumbnail: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  trailerPlayButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.dark.text,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  castList: {
    paddingHorizontal: Spacing.lg,
  },
  castCard: {
    alignItems: "center",
    width: 80,
  },
  castAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  castInfo: {
    alignItems: "center",
  },
  castName: {
    color: Colors.dark.text,
    fontWeight: "500",
    textAlign: "center",
  },
  castCharacter: {
    color: Colors.dark.textTertiary,
    textAlign: "center",
    fontSize: 12,
  },
  similarList: {
    paddingHorizontal: Spacing.lg,
  },
  similarCard: {
    width: 100,
    gap: Spacing.sm,
  },
  similarImage: {
    width: 100,
    height: 150,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.surface,
  },
  similarTitle: {
    color: Colors.dark.text,
    fontWeight: "500",
  },
});
