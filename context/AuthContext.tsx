import { loginUser as dbLogin, registerUser as dbRegister, getDatabase } from '@/services/db';
import React, { createContext, useContext, useEffect, useState } from 'react';

const db = getDatabase();

export interface User {
    id: number;
    username: string;
    is_premium: number; // 0 or 1
}


interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => boolean; // returns success
    logout: () => void;
    register: (username: string, password: string) => boolean; // returns success
    updatePremium: (isPremium: boolean) => void;
}


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Fix: Ensure useAuth default works even if context not provided (though in App it will be)
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Create tables on startup via db.ts logic if needed, but db.ts handles queries.
        // However, DB init usually happens once. Let's ensure tables exist.
        // We can run a quick init check or just rely on db.ts calls working if tables exist.
        // Let's add explicit table creation here to be safe as db.ts didn't have an export initDB that was auto-called.
        try {
            db.execSync(`
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, is_premium INTEGER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, movie_id TEXT, title TEXT, poster_url TEXT, watched_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, movie_id TEXT, title TEXT, poster_url TEXT);
        CREATE TABLE IF NOT EXISTS watchlist (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, movie_id TEXT, title TEXT, poster_url TEXT);
        `);
            // Simple migration: try to add the column if it doesn't exist
            try {
                db.execSync('ALTER TABLE users ADD COLUMN is_premium INTEGER DEFAULT 0;');
            } catch (e) {
                // If column already exists or table doesn't exist yet, ignore
            }
        } catch (e) { console.error("DB Init error", e); }
    }, []);

    const login = (username: string, password: string) => {
        const userRow = dbLogin(username, password);
        if (userRow) {
            setUser(userRow as User);
            return true;
        }
        return false;
    };

    const register = (username: string, password: string) => {
        const id = dbRegister(username, password);
        if (id) {
            // Auto login after register? Optional. Let's just return true.
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const updatePremium = (status: boolean) => {
        if (user) {
            const success = require('@/services/db').updatePremiumStatus(user.id, status);
            if (success) {
                setUser({ ...user, is_premium: status ? 1 : 0 });
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updatePremium }}>
            {children}
        </AuthContext.Provider>
    );
};
