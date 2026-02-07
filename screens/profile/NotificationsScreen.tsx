import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    newContent: true,
    recommendations: false,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const NotificationItem = ({
    title,
    description,
    value,
    onValueChange
  }: {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationTextContainer}>
        <ThemedText type="body" style={styles.notificationTitle}>
          {title}
        </ThemedText>
        <ThemedText type="small" style={styles.notificationDescription}>
          {description}
        </ThemedText>
      </View>
      <Switch
        trackColor={{ false: Colors.dark.surface, true: Colors.dark.primary }}
        thumbColor={value ? Colors.light.backgroundDefault : Colors.dark.textTertiary}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="h3" style={styles.title}>Notifications</ThemedText>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Push Notifications</ThemedText>
        <NotificationItem
          title="Push Notifications"
          description="Receive push notifications on your device"
          value={notifications.push}
          onValueChange={() => toggleSwitch('push')}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Email Notifications</ThemedText>
        <NotificationItem
          title="Email Notifications"
          description="Receive email notifications"
          value={notifications.email}
          onValueChange={() => toggleSwitch('email')}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Content Updates</ThemedText>
        <NotificationItem
          title="New Content"
          description="Get notified about new content"
          value={notifications.newContent}
          onValueChange={() => toggleSwitch('newContent')}
        />
        <View style={styles.divider} />
        <NotificationItem
          title="Recommendations"
          description="Personalized content recommendations"
          value={notifications.recommendations}
          onValueChange={() => toggleSwitch('recommendations')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
    paddingHorizontal: Spacing.lg,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  title: {
    color: Colors.dark.text,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.dark.primary,
    marginBottom: Spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  notificationTitle: {
    color: Colors.dark.text,
    marginBottom: 2,
  },
  notificationDescription: {
    color: Colors.dark.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.backgroundDefault,
    marginVertical: Spacing.sm,
  },
});

export default NotificationsScreen;
