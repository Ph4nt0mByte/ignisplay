import { Colors } from '@/constants/theme';
import ProfileScreen from '@/screens/ProfileScreen';
import AboutScreen from '@/screens/profile/AboutScreen';
import AccountScreen from '@/screens/profile/AccountScreen';
import HelpCenterScreen from '@/screens/profile/HelpCenterScreen';
import NotificationsScreen from '@/screens/profile/NotificationsScreen';
import PlaybackScreen from '@/screens/profile/PlaybackScreen';
import { ProfileStackParamList } from '@/types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.dark.backgroundRoot,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'Account Settings' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notification Settings' }}
      />
      <Stack.Screen
        name="Playback"
        component={PlaybackScreen}
        options={{ title: 'Playback Settings' }}
      />
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{ title: 'Help Center' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
