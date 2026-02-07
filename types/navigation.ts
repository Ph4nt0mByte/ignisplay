import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  MainTabs: undefined;
  VideoPlayer: {
    videoUrl?: string;
    title?: string;
    id?: string;
    type?: "movie" | "series";
    posterUrl?: string;
  };
  Account: undefined;
  Notifications: undefined;
  Playback: undefined;
  HelpCenter: undefined;
  About: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: undefined;
  MyListTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  Browse: undefined;
  Detail: {
    id: string;
    title: string;
    posterUrl: string;
    description: string;
    year?: string;
    rating?: string;
    duration?: string;
    type?: "movie" | "series";
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Account: undefined;
  Notifications: undefined;
  Playback: undefined;
  HelpCenter: undefined;
  About: undefined;
};
