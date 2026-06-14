import React from "react";
import { Pressable, View } from "react-native";
import { tabs } from "../utils/constants";

import HomeIcon from "../assets/HomeIcon.svg";
import BookIcon from "../assets/BookIcon.svg";
import AddIcon from "../assets/AddIncon.svg";
import ProfileIcon from "../assets/ProfileIcon.svg";

const tabIcons = {
  home: HomeIcon,
  library: BookIcon,
  newBook: AddIcon,
  profile: ProfileIcon
};

function AppTabBar({ activeTab, globalStyles, onTabPress, theme }) {
  return (
    <View style={globalStyles.tabBar}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        const Icon = tabIcons[tab.key] || HomeIcon;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={[globalStyles.tab, active && globalStyles.activeTab]}
          >
            <Icon
              width={24}
              height={24}
              color={active ? "#ffffff" : theme.subtext}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default AppTabBar;
