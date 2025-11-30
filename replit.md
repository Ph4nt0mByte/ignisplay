# Ignisplay - Movie & Series Streaming App

## Overview
Ignisplay is a mobile movie and series streaming app built with Expo/React Native. It features a modern dark-themed UI with purple accents, showcasing movies and TV series in a Netflix-style interface.

## Current State
- **Phase**: Frontend prototype complete
- **Status**: Running and functional
- **Platform**: Expo (iOS, Android, Web)

## Recent Changes
- 2024-11-30: Initial prototype created with Home, Search, Downloads, and Profile screens
- Generated app icon with purple flame/play button design
- Implemented hero banner, trending, continue watching, and new releases sections
- Created detail screen with cast & crew and similar titles

## Project Architecture

### Navigation Structure
- **MainTabNavigator**: Bottom tab navigation with 4 tabs
  - HomeTab (HomeStackNavigator)
  - SearchTab
  - DownloadsTab
  - ProfileTab

- **HomeStackNavigator**: Stack navigation within Home tab
  - Home screen (main content)
  - Detail screen (movie/series details)

### Screen Overview
1. **Home Screen**: Featured hero banner, horizontal scrolling sections (Trending, Continue Watching, New Releases)
2. **Search Screen**: Empty state with search prompt
3. **Downloads Screen**: Empty state for downloaded content
4. **Profile Screen**: User profile with settings and preferences
5. **Detail Screen**: Full movie/series information with cast and similar titles

### Key Components
- `HeaderTitle.tsx`: App header with logo and actions
- `ThemedText.tsx`: Themed typography component
- `ThemedView.tsx`: Themed container component
- `ErrorBoundary.tsx` & `ErrorFallback.tsx`: Error handling with restart capability

### Design System (constants/theme.ts)
- **Primary Color**: #ad2bee (purple)
- **Background**: #1c1022 (dark)
- **Surface**: #2d1f36
- **Text**: White with secondary/tertiary variations

## User Preferences
- Dark theme preferred
- Modern streaming app aesthetic
- Movie poster-style cards
- Progress indicators for continue watching

## Tech Stack
- Expo SDK 54
- React Navigation 7
- React Native Reanimated
- Expo Linear Gradient
- TypeScript

## File Structure
```
/
├── App.tsx                    # Root component
├── app.json                   # Expo configuration
├── constants/theme.ts         # Design tokens
├── components/
│   ├── HeaderTitle.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   ├── ErrorBoundary.tsx
│   └── ErrorFallback.tsx
├── navigation/
│   ├── MainTabNavigator.tsx
│   ├── HomeStackNavigator.tsx
│   └── screenOptions.ts
├── screens/
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   ├── SearchScreen.tsx
│   ├── DownloadsScreen.tsx
│   └── ProfileScreen.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── useScreenInsets.ts
│   └── useColorScheme.ts
└── assets/images/
    └── icon.png               # App icon
```

## Notes
- This is a frontend prototype with mock data
- No backend or persistent storage implemented
- Uses external image URLs for movie posters
