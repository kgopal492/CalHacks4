import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import CameraScreen from '../screens/CameraScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: "#6075ff",
    },
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Camera':
            iconName = Platform.OS === 'ios'
              ? `ios-camera${focused ? '' : '-outline'}`
              : 'md-camera';
            break;
          case 'Home':
            iconName = Platform.OS === 'ios'
              ? `ios-home${focused ? '' : '-outline'}`
              : 'md-home';
            break;
          case 'Settings':
            iconName = Platform.OS === 'ios'
              ? `ios-options${focused ? '' : '-outline'}`
              : 'md-options';
        }
        return (
          <Ionicons
            name={iconName}
            size={36}
            style={{ marginBottom: -3}}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
  }
);
