import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    textTertiary: "#9ca3af",
    buttonText: "#FFFFFF",
    tabIconDefault: "rgba(255, 255, 255, 0.5)",
    tabIconSelected: "#ad2bee",
    link: "#ad2bee",
    primary: "#ad2bee",
    backgroundRoot: "#f7f6f8",
    backgroundDefault: "#E6E6E6",
    backgroundSecondary: "#D9D9D9",
    backgroundTertiary: "#CCCCCC",
    surface: "#2d1f36",
    overlay: "rgba(255, 255, 255, 0.2)",
    success: "#10b981",
    error: "#ef4444",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#d1d5db",
    textTertiary: "#9ca3af",
    buttonText: "#FFFFFF",
    tabIconDefault: "rgba(255, 255, 255, 0.5)",
    tabIconSelected: "#ad2bee",
    link: "#ad2bee",
    primary: "#ad2bee",
    backgroundRoot: "#1c1022",
    backgroundDefault: "#2d1f36",
    backgroundSecondary: "#3d2a46",
    backgroundTertiary: "#4d3556",
    surface: "#2d1f36",
    overlay: "rgba(255, 255, 255, 0.2)",
    success: "#10b981",
    error: "#ef4444",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 48,
  tabBarHeight: 60,
  headerHeight: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  h4: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
  },
};
