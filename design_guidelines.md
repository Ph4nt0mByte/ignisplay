# Ignisplay - Design Guidelines (Compacted)

## Architecture

### Authentication
**Required for:** Watch history, personalized recommendations, cross-device sync, downloads

**Implementation:**
- Primary: Apple Sign-In (iOS), Google Sign-In (Android)
- Fallback: Email/password
- Mock auth in prototype using local state

**Login/Signup screens:**
- SSO buttons (prominent) → Email/password option → "Forgot Password" link → Privacy/Terms links

**Account screen:**
- Display: name, email, profile avatar (customizable from presets)
- Log out: Confirmation alert required
- Delete account: Settings > Account > Delete (double confirmation)

### Navigation
**Tab Bar (Bottom, 60px + safe area):**
1. Home (Feather "home") - Default active
2. Search (Feather "search")
3. Downloads (Feather "download")
4. Profile (Feather "user")

**Specs:**
- Background: `#1c1022` @ 90% opacity
- Active: `#ad2bee` | Inactive: White @ 50% opacity
- Icon size: 24px

---

## Screens

### 1. Home Screen
**Header (64px, sticky, blur backdrop):**
- Left: "Ignisplay" logo (2xl, font-black)
- Right: Search icon + Profile avatar (32px circle)
- Background: Dark @ 80% opacity

**Content (ScrollView):**
- Safe area: Top = 64px, Bottom = 80px (tab + 20px)
- Sections order:
  1. **Hero Banner** (full width, min 480px height)
     - Background: Poster + gradient (rgba(28,16,34,0.8) bottom → transparent @ 50%)
     - Content (16px padding, bottom aligned):
       - Title: 28px bold white
       - Description: 14px gray-300, 2-3 lines max
       - Buttons (48px height, 84px min-width, 8px radius, 12px gap):
         - "Play" (purple bg, white text, play icon)
         - "More Info" (white/20 bg, white text, info icon)
     - Border radius: 12px mobile, 0px desktop
  
  2. **Horizontal Sections** (Trending, Continue Watching, New Releases)
     - Title: 20px bold, 16px h-padding, 8px bottom, 16px top
     - Container: Hide scrollbar, 16px padding, 16px gap

**Card Types:**
- **Poster Cards** (Trending/New Releases):
  - Size: 128px (md: 160px), 2:3 ratio, 8px radius
  - Title below: 16px medium white, truncate, 8px gap

- **Continue Watching**:
  - Size: 192px (md: 224px), 16:9 ratio, 8px radius
  - Overlay: Black/60 gradient bottom-up
  - Content (8px padding): Title (16px medium white) + Progress bar (4px height, white/30 bg, purple fill, 4px gap)
  - Play button: 48px circle, white/20 bg blur, 36px white icon (centered)

### 2. Search Screen
**Header:** Default nav, "Search" title, integrated search bar

**Content (ScrollView/FlatList):**
- Safe area: Top = 20px, Bottom = 80px
- Empty state: Search icon + "Search for movies and series" (centered)
- Results: Grid (2-3 columns), poster cards style
- Components: Search bar (with clear), filter chips (Genre, Year, Rating)

### 3. Downloads Screen
**Header:** Default nav, "Downloads" title, Settings icon (right)

**Content (FlatList):**
- Safe area: Top = 20px, Bottom = 80px
- Empty state: Download icon + "No downloads yet"
- List: Thumbnail, title, file size, delete button
- Show progress cards for active downloads

### 4. Profile Screen
**Header:** Custom, dark bg, no title

**Content (ScrollView):**
- Safe area: Top = insets.top + 20px, Bottom = 80px
- Sections:
  1. Profile card (avatar, name, email)
  2. "My List" shortcut
  3. Settings list (Account, Notifications, Playback)
  4. Log out button (destructive style)

### 5. Detail Screen (Modal)
**Header (transparent → opaque on scroll):**
- Left: Close (X) | Right: Bookmark

**Content (ScrollView):**
- Safe area: Top = 0, Bottom = insets.bottom + 20px
- Sections: Hero image → Title/metadata (year, rating, duration) → Description → Play/Download buttons → Cast & Crew → Similar titles (horizontal)

---

## Design System

### Colors
```
Primary: #ad2bee
Bg Dark: #1c1022
Bg Light: #f7f6f8
Text Primary: #ffffff
Text Secondary: #d1d5db (gray-300)
Text Tertiary: #9ca3af (gray-400)
Surface: #2d1f36
Overlay: rgba(255,255,255,0.2)
Success: #10b981
Error: #ef4444
```

### Typography
Font: System (SF Pro/Roboto), Inter fallback
```
H1: 28px bold
H2: 24px bold
H3: 20px bold
Body: 16px medium
Caption: 14px regular
Small: 12px regular
```

### Spacing
`xs:4 sm:8 md:12 lg:16 xl:20 2xl:24 3xl:32`

### Radius
`sm:4 md:8 lg:12 xl:16 full:9999`

### Icons
Library: Feather (@expo/vector-icons)
Sizes: `Small:16 Medium:24 Large:32 XL:48`

### Touch Feedback
- Default: Opacity 0.7 on press (no scale)
- Buttons: Primary darkens 10%, Secondary bg opacity → 0.3
- Cards: Scale 0.98 + subtle shadow

### Shadows
**FAB (Play overlay):**
`offset:{0,2} opacity:0.10 radius:2 color:#000`

**Cards (elevated):**
`offset:{0,4} opacity:0.15 radius:8 color:#000`

### Assets Required
1. **Logo:** "Ignisplay" wordmark
2. **Avatars (6 presets, purple on dark):** Film reel, Popcorn, Camera, Director's chair, Clapperboard, Theater masks
3. **Placeholders:** Gradient + text for missing posters
4. **Empty states:** Magnifying glass (search), Cloud (downloads), Play circle (history)

### Accessibility
- Min touch target: 44x44px
- Contrast: 4.5:1 body, 3:1 large text
- Accessible labels on icon buttons
- Visible focus indicators (keyboard/TV)
- Support dynamic type (test @ 200%)
- Meaningful image descriptions for screen readers

---

**Token count: ~1,950** | All critical specs, patterns, and requirements preserved.