import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface HeaderTitleProps {
  title: string;
}

export function HeaderTitle({ title }: HeaderTitleProps) {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <ThemedText style={styles.title}>{title}</ThemedText>
    </View>
  );
}

interface HeaderActionsProps {
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export function HeaderActions({ onSearchPress, onProfilePress }: HeaderActionsProps) {
  return (
    <View style={styles.actions}>
      {onSearchPress && (
        <Pressable
          onPress={onSearchPress}
          style={({ pressed }) => [
            styles.actionButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          hitSlop={8}
        >
          <Feather name="search" size={24} color={Colors.dark.text} />
        </Pressable>
      )}
      <Pressable
        onPress={onProfilePress}
        style={({ pressed }) => [
          styles.profileButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
        hitSlop={8}
      >
        <View style={styles.avatar}>
          <Feather name="user" size={16} color={Colors.dark.text} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: Spacing.sm,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginRight: Spacing.md,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  profileButton: {
    padding: Spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
