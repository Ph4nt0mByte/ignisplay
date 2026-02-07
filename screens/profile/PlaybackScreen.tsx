import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PlaybackScreen = () => {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    autoPlayNext: true,
    autoPlayTrailer: true,
    videoQuality: 'High',
    downloadQuality: 'High',
    dataSaver: false,
    autoplayPreview: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const SettingItem = ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <ThemedText type="body" style={styles.settingTitle}>
          {title}
        </ThemedText>
        <ThemedText type="small" style={styles.settingDescription}>
          {description}
        </ThemedText>
      </View>
      <View style={styles.settingControl}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="h3" style={styles.title}>Playback Settings</ThemedText>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Playback</ThemedText>
        <SettingItem
          title="Autoplay Next Episode"
          description="Automatically play the next episode in a series"
        >
          <Switch
            value={settings.autoPlayNext}
            onValueChange={() => toggleSetting('autoPlayNext')}
            trackColor={{ false: Colors.dark.surface, true: Colors.dark.primary }}
            thumbColor={settings.autoPlayNext ? Colors.light.backgroundDefault : Colors.dark.textTertiary}
          />
        </SettingItem>

        <View style={styles.divider} />

        <SettingItem
          title="Autoplay Trailers"
          description="Automatically play trailers for movies and shows"
        >
          <Switch
            value={settings.autoPlayTrailer}
            onValueChange={() => toggleSetting('autoPlayTrailer')}
            trackColor={{ false: Colors.dark.surface, true: Colors.dark.primary }}
            thumbColor={settings.autoPlayTrailer ? Colors.light.backgroundDefault : Colors.dark.textTertiary}
          />
        </SettingItem>

        <View style={styles.divider} />

        <SettingItem
          title="Autoplay Previews"
          description="Automatically play previews while browsing"
        >
          <Switch
            value={settings.autoplayPreview}
            onValueChange={() => toggleSetting('autoplayPreview')}
            trackColor={{ false: Colors.dark.surface, true: Colors.dark.primary }}
            thumbColor={settings.autoplayPreview ? Colors.light.backgroundDefault : Colors.dark.textTertiary}
          />
        </SettingItem>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Video Quality</ThemedText>
        <SettingItem
          title="Streaming Quality"
          description="Higher quality uses more data"
        >
          <ThemedText type="body" style={styles.qualityText}>
            {settings.videoQuality}
          </ThemedText>
        </SettingItem>

        <View style={styles.divider} />

        <SettingItem
          title="Download Quality"
          description="Higher quality takes more storage"
        >
          <ThemedText type="body" style={styles.qualityText}>
            {settings.downloadQuality}
          </ThemedText>
        </SettingItem>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Data Usage</ThemedText>
        <SettingItem
          title="Data Saver"
          description="Reduce data usage when not on Wi-Fi"
        >
          <Switch
            value={settings.dataSaver}
            onValueChange={() => toggleSetting('dataSaver')}
            trackColor={{ false: Colors.dark.surface, true: Colors.dark.primary }}
            thumbColor={settings.dataSaver ? Colors.light.backgroundDefault : Colors.dark.textTertiary}
          />
        </SettingItem>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    color: Colors.dark.text,
    marginBottom: 2,
  },
  settingDescription: {
    color: Colors.dark.textTertiary,
  },
  settingControl: {
    marginLeft: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.backgroundDefault,
    marginVertical: Spacing.sm,
  },
  qualityText: {
    color: Colors.dark.primary,
  },
});

export default PlaybackScreen;
