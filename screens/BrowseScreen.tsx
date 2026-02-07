import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { getDiscoverMovies, Movie } from "@/src/utils/movieUtils";
import type { HomeStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BrowseScreenProps = {
    navigation: NativeStackNavigationProp<HomeStackParamList, "Browse">;
};

const POSTER_WIDTH = 110;
const ITEM_HEIGHT = POSTER_WIDTH * 1.5;

function MovieGridItem({ movie, onPress }: { movie: Movie; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.gridItem,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
        >
            <Image
                source={{ uri: movie.posterUrl }}
                style={styles.posterImage}
                resizeMode="cover"
            />
            <ThemedText type="small" style={styles.posterTitle} numberOfLines={1}>
                {movie.title}
            </ThemedText>
        </Pressable>
    );
}

export default function BrowseScreen({ navigation }: BrowseScreenProps) {
    const insets = useSafeAreaInsets();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMovies = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const newMovies = await getDiscoverMovies(page);
            if (newMovies.length === 0) {
                setHasMore(false);
            } else {
                setMovies((prev) => [...prev, ...newMovies]);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Failed to load movies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

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

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <ThemedText type="h3">Explore Movies</ThemedText>
            </View>
            <FlatList
                data={movies}
                renderItem={({ item }) => (
                    <MovieGridItem movie={item} onPress={() => navigateToDetail(item)} />
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                numColumns={3}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                onEndReached={loadMovies}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.dark.primary} />
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.backgroundRoot,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.backgroundSecondary,
    },
    listContent: {
        padding: Spacing.md,
    },
    columnWrapper: {
        justifyContent: "space-between",
        marginBottom: Spacing.md,
    },
    gridItem: {
        width: "31%",
        gap: Spacing.xs,
    },
    posterImage: {
        width: "100%",
        aspectRatio: 2 / 3,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.dark.surface,
    },
    posterTitle: {
        color: Colors.dark.text,
        fontSize: 12,
        fontWeight: "500",
    },
    loadingContainer: {
        paddingVertical: Spacing.xl,
        alignItems: "center",
    },
});
