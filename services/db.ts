import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("ignisplay.db");

// Re-export this so screens can use it directly if needed for custom queries
export const getDatabase = () => db;

interface MovieInput {
    id: string;
    title: string;
    posterUrl?: string; // posterUrl might be optional or null
    [key: string]: any;
}

// Auth
export const registerUser = (username: string, password: string) => {
    try {
        const res = db.runSync('INSERT INTO users (username, password) VALUES (?, ?)', username, password);
        return res.lastInsertRowId;
    }
    catch (e) {
        console.error("Register err:", e);
        return null;
    }
};

export const loginUser = (username: string, password: string) => {
    try {
        const row = db.getFirstSync('SELECT * FROM users WHERE username = ? AND password = ?', username, password);
        return row;
    } catch (e) {
        console.error("Login err:", e);
        return null;
    }
};

// History
export const addToHistory = (userId: number, movie: MovieInput) => {
    if (!userId || !movie) return;
    // Check if exists
    const existing: any = db.getFirstSync('SELECT * FROM history WHERE user_id = ? AND movie_id = ?', userId, movie.id);
    if (existing) {
        db.runSync('UPDATE history SET watched_at = CURRENT_TIMESTAMP WHERE id = ?', existing.id);
    } else {
        db.runSync(
            'INSERT INTO history (user_id, movie_id, title, poster_url) VALUES (?, ?, ?, ?)',
            userId, movie.id, movie.title, movie.posterUrl || ""
        );
    }
};

export const getUserHistory = (userId: number) => {
    if (!userId) return [];
    return db.getAllSync('SELECT * FROM history WHERE user_id = ? ORDER BY watched_at DESC', userId);
};

// Favorites
export const toggleFavorite = (userId: number, movie: MovieInput) => {
    if (!userId || !movie) return false;
    const existing: any = db.getFirstSync('SELECT * FROM favorites WHERE user_id = ? AND movie_id = ?', userId, movie.id);
    if (existing) {
        db.runSync('DELETE FROM favorites WHERE id = ?', existing.id);
        return false; // Removed
    } else {
        db.runSync(
            'INSERT INTO favorites (user_id, movie_id, title, poster_url) VALUES (?, ?, ?, ?)',
            userId, movie.id, movie.title, movie.posterUrl || ""
        );
        return true; // Added
    }
};

export const isFavorite = (userId: number, movieId: string) => {
    if (!userId || !movieId) return false;
    const existing = db.getFirstSync('SELECT * FROM favorites WHERE user_id = ? AND movie_id = ?', userId, movieId);
    return !!existing;
};

export const getUserFavorites = (userId: number) => {
    if (!userId) return [];
    return db.getAllSync('SELECT * FROM favorites WHERE user_id = ?', userId);
};

// Watchlist (My List)
export const toggleWatchlist = (userId: number, movie: MovieInput) => {
    if (!userId || !movie) return false;
    const existing: any = db.getFirstSync('SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?', userId, movie.id);
    if (existing) {
        db.runSync('DELETE FROM watchlist WHERE id = ?', existing.id);
        return false; // Removed
    } else {
        db.runSync(
            'INSERT INTO watchlist (user_id, movie_id, title, poster_url) VALUES (?, ?, ?, ?)',
            userId, movie.id, movie.title, movie.posterUrl || ""
        );
        return true; // Added
    }
};

export const isInWatchlist = (userId: number, movieId: string) => {
    if (!userId || !movieId) return false;
    const existing = db.getFirstSync('SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?', userId, movieId);
    return !!existing;
};

export const getUserWatchlist = (userId: number) => {
    if (!userId) return [];
    return db.getAllSync('SELECT * FROM watchlist WHERE user_id = ?', userId);
};

export const updatePremiumStatus = (userId: number, isPremium: boolean) => {
    try {
        db.runSync('UPDATE users SET is_premium = ? WHERE id = ?', isPremium ? 1 : 0, userId);
        return true;
    } catch (e) {
        console.error("Update premium status error:", e);
        return false;
    }
};
